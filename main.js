document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const resumeForm = document.getElementById('resume-form');
    const previewBtn = document.getElementById('preview-btn');
    const downloadBtn = document.getElementById('download-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resumePreview = document.getElementById('resume-preview');
    const templateSelect = document.getElementById('template');
    const profileUpload = document.getElementById('profile-upload');
    const profileImage = document.getElementById('profile-image');
    const profilePreview = document.getElementById('profile-preview');
    
    // Add more experience/education/skills
    const addExperienceBtn = document.getElementById('add-experience');
    const experienceContainer = document.getElementById('experience-container');
    const addEducationBtn = document.getElementById('add-education');
    const educationContainer = document.getElementById('education-container');
    const addSkillBtn = document.getElementById('add-skill');
    const skillsContainer = document.getElementById('skills-container');
    
    // Profile image handling
    profileUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                profileImage.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Add experience
    addExperienceBtn.addEventListener('click', function() {
        const newExperience = document.querySelector('.experience-item').cloneNode(true);
        clearInputs(newExperience);
        experienceContainer.appendChild(newExperience);
        setupRemoveButtons();
    });
    
    // Add education
    addEducationBtn.addEventListener('click', function() {
        const newEducation = document.querySelector('.education-item').cloneNode(true);
        clearInputs(newEducation);
        educationContainer.appendChild(newEducation);
        setupRemoveButtons();
    });
    
    // Add skill
    addSkillBtn.addEventListener('click', function() {
        const newSkill = document.querySelector('.skill-row').cloneNode(true);
        clearInputs(newSkill);
        skillsContainer.appendChild(newSkill);
        setupRemoveButtons();
    });
    
    // Clear inputs in a cloned element
    function clearInputs(element) {
        const inputs = element.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.type !== 'button') {
                input.value = '';
            }
        });
    }
    
    // Setup remove buttons
    function setupRemoveButtons() {
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                // Don't remove the last item in each section
                const parent = this.closest('.experience-item, .education-item, .skill-row');
                const container = parent.parentElement;
                if (container.children.length > 1) {
                    parent.remove();
                } else {
                    alert('You need to have at least one item in each section.');
                }
            });
        });
    }
    
    // Initialize remove buttons
    setupRemoveButtons();
    
    // Preview resume
    previewBtn.addEventListener('click', function() {
        generateResume();
    });
    
    // Download PDF
    downloadBtn.addEventListener('click', function() {
        generateResume(true);
    });
    
    // Reset form
    resetBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset the form? All your data will be lost.')) {
            resumeForm.reset();
            profileImage.src = 'assets/default-profile.jpg';
            resumePreview.innerHTML = `
                <div class="preview-placeholder">
                    <i class="fas fa-file-alt"></i>
                    <p>Your resume preview will appear here</p>
                    <p>Fill out the form to see the preview</p>
                </div>
            `;
            
            // Reset to one item per section (keeping only the first)
            const sections = {
                experience: experienceContainer,
                education: educationContainer,
                skills: skillsContainer
            };
            
            for (const [section, container] of Object.entries(sections)) {
                while (container.children.length > 1) {
                    container.removeChild(container.lastChild);
                }
                clearInputs(container.firstElementChild);
            }
        }
    });
    
    // Generate resume HTML
    function generateResume(download = false) {
        // Get form values
        const formData = getFormData();
        
        if (!formData.fullName || !formData.jobTitle) {
            alert('Please fill in at least your name and job title.');
            return;
        }
        
        // Load the selected template
        const template = templateSelect.value;
        loadTemplateCSS(template);
        
        // Generate HTML based on template
        let resumeHTML;
        switch(template) {
            case 'template1':
                resumeHTML = generateTemplate1(formData);
                break;
            case 'template2':
                resumeHTML = generateTemplate2(formData);
                break;
            case 'template3':
                resumeHTML = generateTemplate3(formData);
                break;
            default:
                resumeHTML = generateTemplate1(formData);
        }
        
        // Display preview
        resumePreview.innerHTML = resumeHTML;
        
        // Download as PDF if requested
        if (download) {
            downloadPDF();
        }
    }
    
    // Get all form data
    function getFormData() {
        return {
            // Personal details
            profileImage: profileImage.src,
            fullName: document.getElementById('full-name').value,
            jobTitle: document.getElementById('job-title').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            linkedin: document.getElementById('linkedin').value,
            
            // Summary
            summary: document.getElementById('summary').value,
            
            // Experience
            experiences: Array.from(document.querySelectorAll('.experience-item')).map(item => ({
                title: item.querySelector('.exp-title').value,
                company: item.querySelector('.exp-company').value,
                start: item.querySelector('.exp-start').value,
                end: item.querySelector('.exp-current').checked ? 'Present' : item.querySelector('.exp-end').value,
                description: item.querySelector('.exp-description').value,
                current: item.querySelector('.exp-current').checked
            })),
            
            // Education
            education: Array.from(document.querySelectorAll('.education-item')).map(item => ({
                degree: item.querySelector('.edu-degree').value,
                field: item.querySelector('.edu-field').value,
                institution: item.querySelector('.edu-institution').value,
                year: item.querySelector('.edu-year').value
            })),
            
            // Skills
            skills: Array.from(document.querySelectorAll('.skill-row')).map(item => ({
                name: item.querySelector('.skill-name').value,
                level: item.querySelector('.skill-level').value
            })),
            
            // Additional info
            languages: document.getElementById('languages').value,
            certifications: document.getElementById('certifications').value,
            projects: document.getElementById('projects').value
        };
    }
    
    // Load template CSS
    function loadTemplateCSS(template) {
        // Remove any existing template CSS
        const existingLink = document.querySelector('link[data-template]');
        if (existingLink) {
            existingLink.remove();
        }
        
        // Add new template CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `styles/${template}.css`;
        link.dataset.template = template;
        document.head.appendChild(link);
    }
    
    // Generate Template 1 HTML
    function generateTemplate1(data) {
        let html = `
        <div class="resume-template1">
            <div class="resume-header">
                <img src="${data.profileImage}" alt="Profile Photo" class="profile-image">
                <div class="header-info">
                    <h1 class="name">${data.fullName}</h1>
                    <h2 class="title">${data.jobTitle}</h2>
                    <div class="contact-info">
        `;
        
        // Contact info
        if (data.email) html += `<div class="contact-item"><i class="fas fa-envelope"></i> ${data.email}</div>`;
        if (data.phone) html += `<div class="contact-item"><i class="fas fa-phone"></i> ${data.phone}</div>`;
        if (data.address) html += `<div class="contact-item"><i class="fas fa-map-marker-alt"></i> ${data.address}</div>`;
        if (data.linkedin) html += `<div class="contact-item"><i class="fab fa-linkedin"></i> ${data.linkedin}</div>`;
        
        html += `</div></div></div>`;
        
        // Summary
        if (data.summary) {
            html += `
            <div class="section">
                <h3 class="section-title">Professional Summary</h3>
                <p class="summary-text">${data.summary}</p>
            </div>
            `;
        }
        
        // Experience
        if (data.experiences.some(exp => exp.title || exp.company)) {
            html += `<div class="section"><h3 class="section-title">Work Experience</h3>`;
            
            data.experiences.forEach(exp => {
                if (exp.title || exp.company) {
                    html += `
                    <div class="experience-item">
                        <h4 class="job-title">${exp.title}</h4>
                        <h5 class="company">${exp.company}</h5>
                        <p class="date">${formatDate(exp.start)} - ${exp.current ? 'Present' : formatDate(exp.end)}</p>
                        <p class="job-description">${exp.description}</p>
                    </div>
                    `;
                }
            });
            
            html += `</div>`;
        }
        
        // Education
        if (data.education.some(edu => edu.degree || edu.institution)) {
            html += `<div class="section"><h3 class="section-title">Education</h3>`;
            
            data.education.forEach(edu => {
                if (edu.degree || edu.institution) {
                    html += `
                    <div class="education-item">
                        <h4 class="degree">${edu.degree} ${edu.field ? `in ${edu.field}` : ''}</h4>
                        <h5 class="institution">${edu.institution}</h5>
                        <p class="date">Graduated: ${formatDate(edu.year)}</p>
                    </div>
                    `;
                }
            });
            
            html += `</div>`;
        }
        
        // Skills
        if (data.skills.some(skill => skill.name)) {
            html += `
            <div class="section">
                <h3 class="section-title">Skills</h3>
                <div class="skills-container">
            `;
            
            data.skills.forEach(skill => {
                if (skill.name) {
                    html += `<div class="skill-item">${skill.name} (${skill.level})</div>`;
                }
            });
            
            html += `</div></div>`;
        }
        
        // Additional info
        let additionalHtml = '';
        if (data.languages) additionalHtml += `<p><strong>Languages:</strong> ${data.languages}</p>`;
        if (data.certifications) additionalHtml += `<p><strong>Certifications:</strong> ${data.certifications}</p>`;
        if (data.projects) additionalHtml += `<p><strong>Projects:</strong> ${data.projects}</p>`;
        
        if (additionalHtml) {
            html += `
            <div class="section">
                <h3 class="section-title">Additional Information</h3>
                <div class="additional-info">${additionalHtml}</div>
            </div>
            `;
        }
        
        html += `</div>`;
        return html;
    }
    
    // Generate Template 2 HTML
    function generateTemplate2(data) {
        let html = `
        <div class="resume-template2">
            <div class="resume-header">
                <img src="${data.profileImage}" alt="Profile Photo" class="profile-image">
                <h1 class="name">${data.fullName}</h1>
                <h2 class="title">${data.jobTitle}</h2>
                <div class="contact-info">
        `;
        
        // Contact info
        if (data.email) html += `<div class="contact-item"><i class="fas fa-envelope"></i> ${data.email}</div>`;
        if (data.phone) html += `<div class="contact-item"><i class="fas fa-phone"></i> ${data.phone}</div>`;
        if (data.address) html += `<div class="contact-item"><i class="fas fa-map-marker-alt"></i> ${data.address}</div>`;
        if (data.linkedin) html += `<div class="contact-item"><i class="fab fa-linkedin"></i> ${data.linkedin}</div>`;
        
        html += `</div><div class="divider"></div>`;
        
        // Summary
        if (data.summary) {
            html += `
            <div class="section">
                <h3 class="section-title">Summary</h3>
                <p class="summary-text">${data.summary}</p>
            </div>
            <div class="divider"></div>
            `;
        }
        
        // Experience
        if (data.experiences.some(exp => exp.title || exp.company)) {
            html += `<div class="section"><h3 class="section-title">Experience</h3>`;
            
            data.experiences.forEach(exp => {
                if (exp.title || exp.company) {
                    html += `
                    <div class="experience-item">
                        <div class="date-column">
                            <p class="date">${formatDate(exp.start)} - ${exp.current ? 'Present' : formatDate(exp.end)}</p>
                        </div>
                        <div class="content-column">
                            <h4 class="job-title">${exp.title}</h4>
                            <h5 class="company">${exp.company}</h5>
                            <p class="job-description">${exp.description}</p>
                        </div>
                    </div>
                    `;
                }
            });
            
            html += `</div><div class="divider"></div>`;
        }
        
        // Education
        if (data.education.some(edu => edu.degree || edu.institution)) {
            html += `<div class="section"><h3 class="section-title">Education</h3>`;
            
            data.education.forEach(edu => {
                if (edu.degree || edu.institution) {
                    html += `
                    <div class="education-item">
                        <div class="date-column">
                            <p class="date">${formatDate(edu.year)}</p>
                        </div>
                        <div class="content-column">
                            <h4 class="degree">${edu.degree}</h4>
                            <h5 class="institution">${edu.institution}</h5>
                            ${edu.field ? `<p>${edu.field}</p>` : ''}
                        </div>
                    </div>
                    `;
                }
            });
            
            html += `</div><div class="divider"></div>`;
        }
        
        // Skills
        if (data.skills.some(skill => skill.name)) {
            html += `
            <div class="section">
                <h3 class="section-title">Skills</h3>
                <div class="skills-container">
            `;
            
            data.skills.forEach(skill => {
                if (skill.name) {
                    html += `<div class="skill-item">${skill.name}</div>`;
                }
            });
            
            html += `</div></div><div class="divider"></div>`;
        }
        
        // Additional info
        let additionalHtml = '';
        if (data.languages) additionalHtml += `<p><strong>Languages:</strong> ${data.languages}</p>`;
        if (data.certifications) additionalHtml += `<p><strong>Certifications:</strong> ${data.certifications}</p>`;
        if (data.projects) additionalHtml += `<p><strong>Projects:</strong> ${data.projects}</p>`;
        
        if (additionalHtml) {
            html += `
            <div class="section">
                <h3 class="section-title">Additional</h3>
                <div class="additional-info">${additionalHtml}</div>
            </div>
            `;
        }
        
        html += `</div>`;
        return html;
    }
    
    // Generate Template 3 HTML
    function generateTemplate3(data) {
        let html = `
        <div class="resume-template3">
            <div class="resume-header">
                <img src="${data.profileImage}" alt="Profile Photo" class="profile-image">
                <div class="header-info">
                    <h1 class="name">${data.fullName}</h1>
                    <h2 class="title">${data.jobTitle}</h2>
                    <div class="contact-info">
        `;
        
        // Contact info
        if (data.email) html += `<div class="contact-item"><i class="fas fa-envelope"></i> ${data.email}</div>`;
        if (data.phone) html += `<div class="contact-item"><i class="fas fa-phone"></i> ${data.phone}</div>`;
        if (data.address) html += `<div class="contact-item"><i class="fas fa-map-marker-alt"></i> ${data.address}</div>`;
        if (data.linkedin) html += `<div class="contact-item"><i class="fab fa-linkedin"></i> ${data.linkedin}</div>`;
        
        html += `</div></div></div>`;
        
        // Summary
        if (data.summary) {
            html += `
            <div class="section">
                <h3 class="section-title">Profile</h3>
                <p class="summary-text">${data.summary}</p>
            </div>
            `;
        }
        
        // Experience
        if (data.experiences.some(exp => exp.title || exp.company)) {
            html += `<div class="section"><h3 class="section-title">Professional Experience</h3>`;
            
            data.experiences.forEach(exp => {
                if (exp.title || exp.company) {
                    html += `
                    <div class="experience-item">
                        <div class="job-header">
                            <h4 class="job-title">${exp.title}</h4>
                            <p class="date">${formatDate(exp.start)} - ${exp.current ? 'Present' : formatDate(exp.end)}</p>
                        </div>
                        <h5 class="company">${exp.company}</h5>
                        <p class="job-description">${exp.description}</p>
                    </div>
                    `;
                }
            });
            
            html += `</div>`;
        }
        
        // Education
        if (data.education.some(edu => edu.degree || edu.institution)) {
            html += `<div class="section"><h3 class="section-title">Education</h3>`;
            
            data.education.forEach(edu => {
                if (edu.degree || edu.institution) {
                    html += `
                    <div class="education-item">
                        <div class="education-header">
                            <h4 class="degree">${edu.degree}</h4>
                            <p class="date">${formatDate(edu.year)}</p>
                        </div>
                        <h5 class="institution">${edu.institution}</h5>
                        ${edu.field ? `<p class="education-details">${edu.field}</p>` : ''}
                    </div>
                    `;
                }
            });
            
            html += `</div>`;
        }
        
        // Skills
        if (data.skills.some(skill => skill.name)) {
            html += `
            <div class="section">
                <h3 class="section-title">Skills & Competencies</h3>
                <div class="skills-container">
            `;
            
            data.skills.forEach(skill => {
                if (skill.name) {
                    html += `<div class="skill-item">${skill.name}</div>`;
                }
            });
            
            html += `</div></div>`;
        }
        
        // Additional info
        let additionalHtml = '';
        if (data.languages) additionalHtml += `<p><strong>Languages:</strong> ${data.languages}</p>`;
        if (data.certifications) additionalHtml += `<p><strong>Certifications:</strong> ${data.certifications}</p>`;
        if (data.projects) additionalHtml += `<p><strong>Notable Projects:</strong> ${data.projects}</p>`;
        
        if (additionalHtml) {
            html += `
            <div class="section">
                <h3 class="section-title">Additional Information</h3>
                <div class="additional-info">${additionalHtml}</div>
            </div>
            `;
        }
        
        html += `</div>`;
        return html;
    }
    
    // Format date from YYYY-MM to Month YYYY
    function formatDate(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString + '-01');
        const options = { year: 'numeric', month: 'long' };
        return date.toLocaleDateString('en-US', options);
    }
    
    // Download as PDF
    function downloadPDF() {
        const element = document.getElementById('resume-preview');
        const opt = {
            margin: 10,
            filename: 'resume.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        // New Promise-based usage:
        html2pdf().set(opt).from(element).save();
    }
    
    // Initialize with Template 1 preview
    loadTemplateCSS('template1');
});
// Download as PDF - Updated version
function downloadPDF() {
    const element = document.getElementById('resume-preview');
    const opt = {
        margin: 10,
        filename: `${document.getElementById('full-name').value || 'resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            logging: true,
            useCORS: true,
            allowTaint: true,
            letterRendering: true
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait' 
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // Show loading indicator
    const downloadBtn = document.getElementById('download-btn');
    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
    downloadBtn.disabled = true;

    // Generate PDF
    html2pdf().set(opt).from(element).toPdf().get('pdf').then(function(pdf) {
        // Add page numbers if multiple pages
        const totalPages = pdf.internal.getNumberOfPages();
        if (totalPages > 1) {
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(10);
                pdf.setTextColor(150);
                pdf.text(`Page ${i} of ${totalPages}`, 
                    pdf.internal.pageSize.getWidth() - 20,
                    pdf.internal.pageSize.getHeight() - 10);
            }
        }
    }).save().finally(function() {
        // Restore button state
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
    });
}