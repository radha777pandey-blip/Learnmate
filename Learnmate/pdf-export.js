/**
 * PDF Export Functionality for LearnMate
 * Uses jsPDF library for generating PDFs
 */

// Load jsPDF from CDN
function loadJSPDF() {
    return new Promise((resolve, reject) => {
        // Check if already loaded
        if (window.jspdf && window.jspdf.jsPDF) {
            resolve(window.jspdf);
            return;
        }
        
        // Check if script already exists
        const existingScript = document.querySelector('script[src*="jspdf"]');
        if (existingScript) {
            // Wait for it to load
            existingScript.addEventListener('load', () => {
                if (window.jspdf) {
                    resolve(window.jspdf);
                } else {
                    reject(new Error('jsPDF failed to load'));
                }
            });
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = () => {
            if (window.jspdf && window.jspdf.jsPDF) {
                resolve(window.jspdf);
            } else {
                reject(new Error('jsPDF library loaded but not available'));
            }
        };
        script.onerror = () => reject(new Error('Failed to load jsPDF'));
        document.head.appendChild(script);
    });
}

/**
 * Export recommendation to PDF
 */
async function exportToPDF(title, content, type) {
    try {
        // Show loading message
        if (window.learnmateUtils) {
            window.learnmateUtils.showToast('Preparing PDF...', 'info');
        }
        
        const jsPDFLib = await loadJSPDF();
        const { jsPDF } = jsPDFLib;
        
        if (!jsPDF) {
            throw new Error('jsPDF not available');
        }
        
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        let yPos = margin;
        
        // Title
        doc.setFontSize(20);
        doc.setTextColor(79, 70, 229); // Indigo color
        const titleLines = doc.splitTextToSize(title, pageWidth - 2 * margin);
        titleLines.forEach(line => {
            doc.text(line, margin, yPos);
            yPos += 10;
        });
        yPos += 5;
        
        // Date
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`, margin, yPos);
        yPos += 10;
        
        // Type badge
        const typeLabels = {
            books: '📚 Book Recommendations',
            courses: '🎓 Online Courses',
            coding: '💻 Coding Practice',
            roadmap: '🚀 Skill Roadmap'
        };
        doc.setFontSize(12);
        doc.setTextColor(129, 140, 248);
        doc.text(typeLabels[type] || 'Recommendations', margin, yPos);
        yPos += 10;
        
        // Line separator
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 10;
        
        // Content - preserve line breaks
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        
        // Split content by line breaks first, then by width
        const contentLines = content.split('\n');
        contentLines.forEach(paragraph => {
            if (paragraph.trim()) {
                const wrappedLines = doc.splitTextToSize(paragraph.trim(), pageWidth - 2 * margin);
                wrappedLines.forEach(line => {
                    if (yPos > pageHeight - margin - 15) {
                        doc.addPage();
                        yPos = margin;
                    }
                    doc.text(line, margin, yPos);
                    yPos += 7;
                });
                yPos += 3; // Space between paragraphs
            }
        });
        
        // Footer on all pages
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(
                `LearnMate - AI-Powered Learning Assistant | Page ${i} of ${totalPages}`,
                pageWidth / 2,
                pageHeight - 10,
                { align: 'center' }
            );
        }
        
        // Generate filename
        const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').substring(0, 30);
        const fileName = `LearnMate_${sanitizedTitle}_${Date.now()}.pdf`;
        
        // Save PDF - this triggers download
        doc.save(fileName);
        
        if (window.learnmateUtils) {
            window.learnmateUtils.showToast('PDF downloaded successfully!', 'success');
        }
        
        return true;
    } catch (error) {
        console.error('PDF export error:', error);
        console.error('Error details:', error.message, error.stack);
        
        let errorMsg = 'Failed to export PDF. ';
        if (error.message.includes('load')) {
            errorMsg += 'Please check your internet connection.';
        } else {
            errorMsg += 'Please try again.';
        }
        
        if (window.learnmateUtils) {
            window.learnmateUtils.showToast(errorMsg, 'error');
        } else {
            alert(errorMsg);
        }
        return false;
    }
}

// Add export button to result boxes
function addExportButton(resultBox, title, content, type) {
    const exportBtn = document.createElement('button');
    exportBtn.className = 'export-btn';
    exportBtn.innerHTML = '📄 Export PDF';
    exportBtn.onclick = () => exportToPDF(title, content, type);
    resultBox.appendChild(exportBtn);
}

// Make function globally available
if (typeof window !== 'undefined') {
    window.exportToPDF = exportToPDF;
    window.addExportButton = addExportButton;
}

