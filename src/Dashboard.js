import React, { useState } from 'react';
import './Dashboard.css';
import logo from './logo.png';

function Dashboard({ onLogout, onAdminAccess, adminVideos = {}, calendarLinks = {}, notifications = [], adminCourses = [], theme, toggleTheme }) {
  const [activeNav, setActiveNav] = useState('courses');
  const [activeTopNav, setActiveTopNav] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [calDate, setCalDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDept, setSelectedDept] = useState('All');
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [videoProgress, setVideoProgress] = useState({});
  const [documents, setDocuments] = useState({
    experienceYears: '',
    company: '',
    companyStatus: 'present',
    aadhar: null,
    pan: null,
    collegeId: null,
    collegeDocType: 'certificate',
    joiningLetter: null,
    paySlips: []
  });

  // Payment Gateway State
  const [paymentTab, setPaymentTab] = useState('pay-now');
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentContact, setStudentContact] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('Course Fee Payment');
  const [paymentHistory, setPaymentHistory] = useState([
    { id: 1, date: '2024-01-15', amount: 5000, reference: 'STU001_001', status: 'completed', paymentId: 'PAY_001' },
    { id: 2, date: '2024-02-20', amount: 10000, reference: 'STU001_002', status: 'completed', paymentId: 'PAY_002' },
    { id: 3, date: '2024-03-10', amount: 2500, reference: 'STU001_003', status: 'pending', paymentId: null }
  ]);
  const [showPaymentAlert, setShowPaymentAlert] = useState(null);
  const [paidSlips, setPaidSlips] = useState([]);

  const departments = ['All', 'Mech', 'Civil', 'CSC/IT', 'Arts', 'Kids'];

  const toggleEnroll = (id) => {
    setEnrolledIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleWatched = (courseId, videoIdx) => {
    setVideoProgress(prev => {
      const key = `${courseId}-${videoIdx}`;
      const updated = { ...prev };
      updated[key] = !updated[key];
      return updated;
    });
  };

  const renderFullCalendar = () => {
    const year = calDate.getFullYear();
    const month = calDate.getMonth();
    const today = new Date();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const weekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const cells = [];

    for (let i = 0; i < firstDay; i++) cells.push(<div key={`e${i}`} className="fcal-cell fcal-empty" />);
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const isSelected = d === selectedDay;
      const pad = String(d).padStart(2, '0');
      const padMonth = String(month + 1).padStart(2, '0');
      const dateKey = `${year}-${padMonth}-${pad}`;
      const links = calendarLinks[dateKey] || [];
      cells.push(
        <div
          key={d}
          className={`fcal-cell${isToday ? ' fcal-today' : ''}${isSelected ? ' fcal-selected' : ''}${links.length > 0 ? ' fcal-has-links' : ''}`}
          onClick={() => setSelectedDay(d)}
        >
          <span className="fcal-day-num">{d}</span>
          {links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="fcal-link"
              onClick={e => e.stopPropagation()}
            >{link.label}</a>
          ))}
        </div>
      );
    }

    return (
      <div className="fullcal-wrapper">
        <div className="fullcal-header">
          <button className="fcal-nav-btn" onClick={() => setCalDate(new Date(year, month - 1, 1))}>&#8249;</button>
          <h2 className="fcal-title">{monthNames[month]} {year}</h2>
          <button className="fcal-nav-btn" onClick={() => setCalDate(new Date(year, month + 1, 1))}>&#8250;</button>
        </div>
        <div className="fullcal-grid">
          {weekDays.map(d => <div key={d} className="fcal-weekday">{d}</div>)}
          {cells}
        </div>
      </div>
    );
  };
  const [courses, setCourses] = useState([]);

  const navItems = [
    { id: 'courses', label: 'Courses to Do' },
    { id: 'assignment', label: 'Assignment' },
    { id: 'quiz', label: 'Quiz Overdue' },
    { id: 'completed', label: 'Completed Courses' }
  ];

  const topNavItems = [
    { id: 'mycourses', label: 'My Courses' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'session', label: 'My Session' },
    { id: 'notification', label: 'Notification' },
    { id: 'documents', label: 'My Documents' },
    { id: 'payment-gateway', label: '💳 Payment Gateway' },
    { id: 'support', label: 'Support' }
  ];

  const unreadCount = notifications.length;

  const renderMyCourses = () => {
    const enrolled = adminCourses.filter(c => enrolledIds.includes(c.id));
    return (
      <div className="content-section">
        <h2>My Courses</h2>
        {enrolled.length === 0 ? (
          <div className="notif-empty">You have not enrolled in any courses yet. Go to Courses to Do and click Enroll.</div>
        ) : (
          <div className="course-list">
            {enrolled.map(course => {
              const videos = adminVideos[course.id] || [];
              return (
                <div key={course.id} className="course-card">
                  <div className="course-card-dept">{course.dept}</div>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  {videos.length > 0 && (
                    <div className="course-videos">
                      <p className="videos-label">Videos ({videos.length})</p>
                      <div className="video-list">
                        {videos.map((v, i) => (
                          <div key={i} className="video-item admin-video">
                            <span>{v.title}</span>
                            {v.url && <span className="video-source">[Online]</span>}
                            {v.file && <span className="video-source">[File]</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="course-actions">
                    <button className="start-btn">Start Course</button>
                    <button className="unenroll-btn" onClick={() => toggleEnroll(course.id)}>Unenroll</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderSession = () => {
    const enrolled = adminCourses.filter(c => enrolledIds.includes(c.id));
    return (
      <div className="content-section">
        <h2>My Session</h2>
        {enrolled.length === 0 ? (
          <div className="notif-empty">No enrolled courses yet. Enroll in courses to track your progress.</div>
        ) : (
          <div className="session-list">
            {enrolled.map(course => {
              const videos = adminVideos[course.id] || [];
              const watched = videos.filter((_, i) => videoProgress[`${course.id}-${i}`]).length;
              const total = videos.length;
              const pct = total === 0 ? 0 : Math.round((watched / total) * 100);
              return (
                <div key={course.id} className="session-card">
                  <div className="session-card-top">
                    <div>
                      <span className="course-card-dept">{course.dept}</span>
                      <h3 className="session-course-title">{course.title}</h3>
                    </div>
                    <span className="session-pct">{pct}%</span>
                  </div>
                  <div className="session-progress-bar">
                    <div className="session-progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="session-stats">{watched} of {total} videos completed</p>
                  {videos.length > 0 && (
                    <div className="session-video-list">
                      {videos.map((v, i) => {
                        const watched = videoProgress[`${course.id}-${i}`];
                        return (
                          <div key={i} className={`session-video-row${watched ? ' watched' : ''}`}>
                            <span className="session-video-check">{watched ? '✓' : '○'}</span>
                            <span className="session-video-title">{v.title}</span>
                            <button
                              className={watched ? 'unwatch-btn' : 'watch-btn'}
                              onClick={() => toggleWatched(course.id, i)}
                            >
                              {watched ? 'Unmark' : 'Mark Watched'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {total === 0 && <p className="session-no-videos">No videos uploaded yet for this course.</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const handleTopNav = (id) => {
    setActiveTopNav(prev => prev === id ? null : id);
    setActiveNav(null);
  };

  const handleSideNav = (id) => {
    setActiveNav(id);
    setActiveTopNav(null);
  };

  const renderNotifications = () => (
    <div className="notif-page">
      <div className="notif-header-row">
        <h2 className="notif-title">Notifications</h2>
        {unreadCount > 0 && <span className="notif-count-badge">{unreadCount}</span>}
      </div>
      {notifications.length === 0 ? (
        <div className="notif-empty">No notifications yet. Admin activity will appear here.</div>
      ) : (
        <div className="notif-list">
          {notifications.map(n => (
            <div key={n.id} className={`notif-item notif-${n.type}`}>
              <span className="notif-dot" />
              <div className="notif-body">
                <p className="notif-msg">{n.msg}</p>
                <span className="notif-time">{n.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const WHATSAPP_NUMBER = '919342215868';

  const renderDocuments = () => {
    const completedSections = {
      experience: Boolean(documents.experienceYears && documents.company),
      id: Boolean(documents.aadhar && documents.pan),
      college: Boolean(documents.collegeId),
      employment: Boolean(documents.joiningLetter && documents.paySlips.length > 0)
    };
    const completionPercentage = Math.round((Object.values(completedSections).filter(Boolean).length / 4) * 100);

    return (
      <div className="content-section">
        <div className="documents-header">
          <h2>Document Verification</h2>
          <p className="documents-subtitle">Submit your professional and educational documents for verification</p>
        </div>

        <div className="documents-progress">
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${completionPercentage}%` }}></div>
          </div>
          <p className="progress-text">Completion: <strong>{completionPercentage}%</strong></p>
        </div>

        <div className="documents-form">
          <form onSubmit={(e) => {
            e.preventDefault();
            alert('Documents submitted for verification. Our team will review and contact you within 2-3 business days.');
          }}>

            {/* Experience Section */}
            <div className="form-section professional">
              <div className="section-header">
                <div className="section-title">
                  <h3>Professional Experience</h3>
                  <p className="section-desc">Provide your work history and experience details</p>
                </div>
                <div className={`section-status ${completedSections.experience ? 'completed' : ''}`}>
                  {completedSections.experience ? '✓' : '○'}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Total Years of Experience <span className="required">*</span></label>
                  <input
                    type="number"
                    min="0"
                    max="70"
                    step="0.5"
                    value={documents.experienceYears}
                    onChange={(e) => setDocuments({...documents, experienceYears: e.target.value})}
                    placeholder="Enter years of experience"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Company Name <span className="required">*</span></label>
                  <input
                    type="text"
                    value={documents.company}
                    onChange={(e) => setDocuments({...documents, company: e.target.value})}
                    placeholder="Enter company name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Employment Status <span className="required">*</span></label>
                  <select
                    value={documents.companyStatus}
                    onChange={(e) => setDocuments({...documents, companyStatus: e.target.value})}
                    required
                  >
                    <option value="present">Currently Working</option>
                    <option value="last">Last Worked</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ID Validation Section */}
            <div className="form-section identity">
              <div className="section-header">
                <div className="section-title">
                  <h3>Identity Verification</h3>
                  <p className="section-desc">Upload government-issued identity documents</p>
                </div>
                <div className={`section-status ${completedSections.id ? 'completed' : ''}`}>
                  {completedSections.id ? '✓' : '○'}
                </div>
              </div>
              <div className="form-group">
                <label>Aadhar Document <span className="required">*</span></label>
                <small className="field-hint">Upload your Aadhar card. Accepted formats: PDF, JPG, PNG</small>
                <label htmlFor="aadhar-doc" className="file-upload-doc">
                  <input
                    id="aadhar-doc"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setDocuments({...documents, aadhar: e.target.files[0]})}
                    required={!documents.aadhar}
                  />
                  <span>Click to upload or drag & drop</span>
                  {documents.aadhar && <p className="file-success">✓ {documents.aadhar.name}</p>}
                </label>
              </div>
              <div className="form-group">
                <label>PAN Document <span className="required">*</span></label>
                <small className="field-hint">Upload your PAN card. Accepted formats: PDF, JPG, PNG</small>
                <label htmlFor="pan-doc" className="file-upload-doc">
                  <input
                    id="pan-doc"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setDocuments({...documents, pan: e.target.files[0]})}
                    required={!documents.pan}
                  />
                  <span>Click to upload or drag & drop</span>
                  {documents.pan && <p className="file-success">✓ {documents.pan.name}</p>}
                </label>
              </div>
            </div>

            {/* College Certificate Section */}
            <div className="form-section education">
              <div className="section-header">
                <div className="section-title">
                  <h3>Educational Qualification</h3>
                  <p className="section-desc">Upload your college certificate or related documents</p>
                </div>
                <div className={`section-status ${completedSections.college ? 'completed' : ''}`}>
                  {completedSections.college ? '✓' : '○'}
                </div>
              </div>
              <div className="form-group">
                <label>College Certificate <span className="required">*</span></label>
                <small className="field-hint">Upload your degree, diploma, or educational certificate. Accepted formats: PDF, JPG, PNG</small>
                <label htmlFor="college-cert" className="file-upload-doc">
                  <input
                    id="college-cert"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setDocuments({...documents, collegeId: e.target.files[0]})}
                    required={!documents.collegeId}
                  />
                  <span>Click to upload or drag & drop</span>
                  {documents.collegeId && <p className="file-success">✓ {documents.collegeId.name}</p>}
                </label>
              </div>
              <div className="form-group">
                <label>Certificate Type <span className="required">*</span></label>
                <select
                  value={documents.collegeDocType}
                  onChange={(e) => setDocuments({...documents, collegeDocType: e.target.value})}
                  required
                >
                  <option value="">Select certificate type</option>
                  <option value="certificate">Degree/Diploma Certificate</option>
                  <option value="tc">TC (Transfer Certificate)</option>
                  <option value="provisional">Provisional Certificate</option>
                  <option value="completion">Course Completion</option>
                </select>
              </div>
            </div>

            {/* Employment Documents Section */}
            <div className="form-section employment">
              <div className="section-header">
                <div className="section-title">
                  <h3>Employment Documentation</h3>
                  <p className="section-desc">Upload joining/relieving letters and recent pay slips</p>
                </div>
                <div className={`section-status ${completedSections.employment ? 'completed' : ''}`}>
                  {completedSections.employment ? '✓' : '○'}
                </div>
              </div>
              <div className="form-group">
                <label>Joining Letter or Relieving Letter <span className="required">*</span></label>
                <small className="field-hint">Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB)</small>
                <label htmlFor="joining-letter" className="file-upload-doc">
                  <input
                    id="joining-letter"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && file.size <= 5242880) {
                        setDocuments({...documents, joiningLetter: file});
                      } else {
                        alert('File size exceeds 5MB limit');
                      }
                    }}
                    required={!documents.joiningLetter}
                  />
                  <div className="upload-area-main">
                    <span className="upload-icon-main-doc">📤</span>
                    <p className="upload-text">Click to browse or drag & drop your file</p>
                  </div>
                  {documents.joiningLetter && <p className="file-success-doc">✓ {documents.joiningLetter.name}</p>}
                </label>
              </div>
              <div className="form-group">
                <label>Pay Slips <span className="required">*</span> (Multiple files allowed)</label>
                <small className="field-hint">Upload at least 1 recent pay slip. Max 5MB per file, up to 10 files</small>
                <label htmlFor="pay-slips" className="file-upload-doc">
                  <input
                    id="pay-slips"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      const validFiles = files.filter(f => f.size <= 5242880);
                      if (validFiles.length < files.length) {
                        alert(`${files.length - validFiles.length} file(s) exceed 5MB limit and were not added`);
                      }
                      setDocuments({...documents, paySlips: validFiles.slice(0, 10)});
                    }}
                    required={documents.paySlips.length === 0}
                  />
                  <div className="upload-area-main">
                    <span className="upload-icon-main-doc">📎</span>
                    <p className="upload-text">Click to browse or drag & drop files</p>
                  </div>
                  {documents.paySlips.length > 0 && (
                    <div className="file-list-doc">
                      <p className="file-count-doc">{documents.paySlips.length} file(s) selected</p>
                      {documents.paySlips.map((file, idx) => (
                        <p key={idx} className="file-item-doc">✓ {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)</p>
                      ))}
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn-doc" disabled={completionPercentage < 100}>
                {completionPercentage < 100 ? `Complete All Sections (${completionPercentage}%)` : 'Submit for Verification'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderPaymentGateway = () => {
    const completedPayments = paymentHistory.filter(p => p.status === 'completed');
    const pendingPayments = paymentHistory.filter(p => p.status === 'pending');
    const lastPaidAmount = completedPayments.length > 0 ? completedPayments[0].amount : null;

    return (
      <div className="payment-gateway-page">
        {showPaymentAlert && (
          <div className={`payment-alert payment-alert-${showPaymentAlert.type}`}>
            <span className="alert-close" onClick={() => setShowPaymentAlert(null)}>✕</span>
            {showPaymentAlert.message}
          </div>
        )}

        <div className="payment-tabs-nav">
          <button 
            className={`payment-tab-btn ${paymentTab === 'pay-now' ? 'active' : ''}`}
            onClick={() => setPaymentTab('pay-now')}
          >
            💸 Pay Now
          </button>
          <button 
            className={`payment-tab-btn ${paymentTab === 'already-paid' ? 'active' : ''}`}
            onClick={() => setPaymentTab('already-paid')}
          >
            ✅ Already Paid
          </button>
          <button 
            className={`payment-tab-btn ${paymentTab === 'history' ? 'active' : ''}`}
            onClick={() => setPaymentTab('history')}
          >
            📋 Payment History
          </button>
        </div>

        {/* Pay Now Section */}
        {paymentTab === 'pay-now' && (
          <div className="payment-section pay-now-section">
            <h2>Create Payment Link</h2>
            <p className="section-subtitle">Generate a payment link to complete your payment securely</p>
            
            <form className="payment-form" onSubmit={(e) => {
              e.preventDefault();
              if (studentName && studentEmail && studentContact && paymentAmount) {
                setShowPaymentAlert({
                  type: 'success',
                  message: `✓ Payment link created! Redirecting to Razorpay checkout for ₹${paymentAmount}...`
                });
                setTimeout(() => {
                  // In real app, redirect to Razorpay
                  alert(`Payment would be processed for ₹${paymentAmount}`);
                }, 2000);
              }
            }}>
              <div className="payment-form-row">
                <div className="payment-form-group">
                  <label>Student Name <span className="required">*</span></label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="payment-form-group">
                  <label>Email <span className="required">*</span></label>
                  <input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div className="payment-form-row">
                <div className="payment-form-group">
                  <label>Contact Number <span className="required">*</span></label>
                  <input
                    type="tel"
                    value={studentContact}
                    onChange={(e) => setStudentContact(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>
              </div>

              <div className="payment-form-group">
                <label>Select Amount (₹) <span className="required">*</span></label>
                <div className="amount-presets">
                  <button type="button" className={`amount-preset ${paymentAmount === '5000' ? 'selected' : ''}`} onClick={() => setPaymentAmount('5000')}>₹5,000</button>
                  <button type="button" className={`amount-preset ${paymentAmount === '10000' ? 'selected' : ''}`} onClick={() => setPaymentAmount('10000')}>₹10,000</button>
                  <button type="button" className={`amount-preset ${paymentAmount === '25000' ? 'selected' : ''}`} onClick={() => setPaymentAmount('25000')}>₹25,000</button>
                  <button type="button" className={`amount-preset ${paymentAmount === '50000' ? 'selected' : ''}`} onClick={() => setPaymentAmount('50000')}>₹50,000</button>
                </div>
              </div>

              <div className="payment-form-row">
                <div className="payment-form-group">
                  <label>Custom Amount (₹)</label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Enter custom amount"
                    min="100"
                  />
                </div>
                <div className="payment-form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={paymentDescription}
                    onChange={(e) => setPaymentDescription(e.target.value)}
                    placeholder="Payment description"
                  />
                </div>
              </div>

              <button type="submit" className="payment-submit-btn">Create Payment Link</button>
            </form>
          </div>
        )}

        {/* Already Paid Section */}
        {paymentTab === 'already-paid' && (
          <div className="payment-section already-paid-section">
            <h2>Payment Status</h2>
            
            {lastPaidAmount ? (
              <div className="payment-status-card completed">
                <div className="status-icon">✅</div>
                <div className="status-content">
                  <h3>Payment Completed</h3>
                  <div className="status-details">
                    <p><strong>Last Payment Amount:</strong> ₹{lastPaidAmount.toLocaleString()}</p>
                    <p><strong>Date:</strong> {new Date(completedPayments[0].date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p><strong>Payment ID:</strong> {completedPayments[0].paymentId}</p>
                    <p><strong>Status:</strong> <span className="status-badge completed">Completed</span></p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="payment-status-card empty">
                <div className="status-icon">❌</div>
                <div className="status-content">
                  <h3>No Payment Records</h3>
                  <p>You haven't made any payments yet. Go to "Pay Now" to create a payment link.</p>
                </div>
              </div>
            )}

            {pendingPayments.length > 0 && (
              <div className="pending-payments">
                <h3>Pending Payments</h3>
                {pendingPayments.map(payment => (
                  <div key={payment.id} className="payment-status-card pending">
                    <div className="status-icon">⏳</div>
                    <div className="status-content">
                      <p><strong>Amount Due:</strong> ₹{payment.amount.toLocaleString()}</p>
                      <p><strong>Reference ID:</strong> {payment.reference}</p>
                      <p><strong>Created:</strong> {new Date(payment.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <p><strong>Status:</strong> <span className="status-badge pending">Pending</span></p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Already Paid Slips Upload Section */}
            <div className="paid-slips-section">
              <div className="slips-header-container">
                <div className="slips-header-text">
                  <h3>Upload Payment Documentation</h3>
                  <p className="section-description">Attach payment proof to complete verification. Supported formats: PDF, Images, Office documents</p>
                </div>
              </div>
              
              <div className="file-upload-container">
                <label className="file-upload-label">
                  <input 
                    type="file" 
                    multiple 
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      files.forEach(file => {
                        const maxSize = 5242880; // 5MB
                        const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                        
                        if (file.size > maxSize) {
                          setShowPaymentAlert({
                            type: 'error',
                            message: `✗ "${file.name}" exceeds 5MB size limit. File size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
                          });
                          return;
                        }
                        
                        if (!validTypes.includes(file.type)) {
                          setShowPaymentAlert({
                            type: 'error',
                            message: `✗ "${file.name}" is not a supported file format`
                          });
                          return;
                        }

                        const fileTypeMap = {
                          'application/pdf': '📄',
                          'image/jpeg': '🖼️',
                          'image/png': '🖼️',
                          'application/msword': '📋',
                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📋'
                        };

                        setPaidSlips(prev => [...prev, {
                          id: Date.now() + Math.random(),
                          name: file.name,
                          size: (file.size / 1024 / 1024).toFixed(2),
                          uploadDate: new Date().toLocaleDateString('en-IN'),
                          type: file.type,
                          icon: fileTypeMap[file.type] || '📎'
                        }]);
                        setShowPaymentAlert({
                          type: 'success',
                          message: `✓ "${file.name}" has been added successfully`
                        });
                      });
                    }}
                  />
                  <div className="file-upload-box">
                    <div className="upload-icon-main">📤</div>
                    <h4>Drag and drop files here</h4>
                    <p>or click to browse from your device</p>
                    <span className="file-format-hint">PDF, JPG, PNG, DOC up to 5MB</span>
                  </div>
                </label>
              </div>

              {/* Uploaded Files List */}
              {paidSlips.length > 0 && (
                <div className="uploaded-slips-list">
                  <div className="slips-list-header">
                    <h4>Attached Files</h4>
                    <span className="file-count-badge">{paidSlips.length} file{paidSlips.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="slips-table">
                    {paidSlips.map((slip, idx) => (
                      <div key={slip.id} className="slips-row">
                        <div className="slip-info">
                          <span className="slip-icon">{slip.icon}</span>
                          <div className="slip-details">
                            <p className="slip-name">{slip.name}</p>
                            <span className="slip-meta">{slip.size}MB • {slip.uploadDate}</span>
                          </div>
                        </div>
                        <div className="slip-actions">
                          <button 
                            className="slip-delete-btn"
                            title="Remove file"
                            onClick={() => {
                              const fileName = slip.name;
                              setPaidSlips(prev => prev.filter(s => s.id !== slip.id));
                              setShowPaymentAlert({
                                type: 'success',
                                message: `✓ "${fileName}" has been removed`
                              });
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    className="submit-slips-btn"
                    onClick={() => {
                      setShowPaymentAlert({
                        type: 'success',
                        message: `✓ ${paidSlips.length} document${paidSlips.length !== 1 ? 's' : ''} submitted for verification successfully`
                      });
                      setTimeout(() => {
                        setPaidSlips([]);
                      }, 2000);
                    }}
                  >
                    <span className="btn-icon">✓</span>
                    Submit {paidSlips.length} Document{paidSlips.length !== 1 ? 's' : ''} for Verification
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment History Section */}
        {paymentTab === 'history' && (
          <div className="payment-section history-section">
            <h2>Payment History</h2>
            {paymentHistory.length === 0 ? (
              <div className="empty-history">
                <p>No payment history available.</p>
              </div>
            ) : (
              <div className="payment-history-table">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount (₹)</th>
                      <th>Reference ID</th>
                      <th>Payment ID</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentHistory.map((record) => (
                      <tr key={record.id}>
                        <td>{new Date(record.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                        <td>₹{record.amount.toLocaleString()}</td>
                        <td>{record.reference}</td>
                        <td>{record.paymentId || 'N/A'}</td>
                        <td><span className={`status-badge ${record.status}`}>{record.status.charAt(0).toUpperCase() + record.status.slice(1)}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderSupport = () => (
    <div className="support-page">
      <h2 className="support-title">Support</h2>
      <div className="support-grid">

        <div className="support-card">
          <div className="support-card-header">Head Office</div>
          <div className="support-card-body">
            <div className="support-row">
              <span className="support-icon">&#128205;</span>
              <span>11A, Thirupati Venkatachalapati, Behind KTM Showroom, Peelamedu, Coimbatore &ndash; 641004</span>
            </div>
            <div className="support-row">
              <span className="support-icon">&#128222;</span>
              <a href="tel:+917418734466" className="support-link">+91 7418 734 466</a>
            </div>
            <div className="support-row">
              <span className="support-icon">&#9993;</span>
              <a href="mailto:info@lasakedu.in" className="support-link">info@lasakedu.in</a>
            </div>
          </div>
        </div>

        <div className="support-card">
          <div className="support-card-header">Branch Office</div>
          <div className="support-card-body">
            <div className="support-row">
              <span className="support-icon">&#128205;</span>
              <span>No.655 F, Shri Paaththaa Avenue, 1st Floor, Above Cheran Tarpaulin, Near GP Signal, Gandhipuram &ndash; 12</span>
            </div>
            <div className="support-row">
              <span className="support-icon">&#128222;</span>
              <a href="tel:+917418734466" className="support-link">+91 7418 734 466</a>
            </div>
            <div className="support-row">
              <span className="support-icon">&#9993;</span>
              <a href="mailto:info@lasakedu.in" className="support-link">info@lasakedu.in</a>
            </div>
          </div>
        </div>

      </div>

      {/* Chat Support */}
      <div className="chat-support-section">
        <div className="chat-support-card">
          <div className="chat-support-left">
            <div className="chat-wa-icon">&#128172;</div>
            <div>
              <p className="chat-support-heading">Chat Support</p>
              <p className="chat-support-sub">Talk to us on WhatsApp — we typically reply within minutes.</p>
              <p className="chat-support-num">+91 93422 15868</p>
            </div>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="chat-wa-btn"
          >
            Open WhatsApp
          </a>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeNav) {
      case 'courses':
        return (
          <div className="content-section">
            <h2>Courses to Do</h2>
            <div className="dept-tabs">
              {departments.map(d => (
                <button
                  key={d}
                  className={`dept-tab${selectedDept === d ? ' dept-tab-active' : ''}`}
                  onClick={() => setSelectedDept(d)}
                >{d}</button>
              ))}
            </div>
            {adminCourses.length === 0 ? (
              <div className="notif-empty">No courses available yet. Admin will add courses soon.</div>
            ) : (() => {
              const filtered = selectedDept === 'All'
                ? adminCourses
                : adminCourses.filter(c => c.dept === selectedDept);
              return filtered.length === 0 ? (
                <div className="notif-empty">No courses for {selectedDept} department yet.</div>
              ) : (
                <div className="course-list">
                  {filtered.map((course) => {
                    const adminCourseVideos = adminVideos[course.id] || [];
                    return (
                      <div key={course.id} className="course-card">
                        <div className="course-card-dept">{course.dept || 'General'}</div>
                        <h3>{course.title}</h3>
                        <p>{course.description}</p>
                        {adminCourseVideos.length > 0 && (
                          <div className="course-videos">
                            <p className="videos-label">Videos ({adminCourseVideos.length})</p>
                            <div className="video-list">
                              {adminCourseVideos.map((video, idx) => (
                                <div key={idx} className="video-item admin-video">
                                  <span>{video.title}</span>
                                  {video.url && <span className="video-source">[Online]</span>}
                                  {video.file && <span className="video-source">[File]</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="course-actions">
                          <button className="start-btn">Start Course</button>
                          <button
                            className={enrolledIds.includes(course.id) ? 'unenroll-btn' : 'enroll-btn'}
                            onClick={() => toggleEnroll(course.id)}
                          >
                            {enrolledIds.includes(course.id) ? 'Unenroll' : 'Enroll'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        );
      case 'assignment':
        return (
          <div className="content-section">
            <h2>Assignments</h2>
            <div className="assignment-list">
              <div className="assignment-card">
                <h3>Assignment 1: Todo App</h3>
                <p className="due-date">Due: June 10, 2026</p>
                <p>Build a todo application with React</p>
                <button className="submit-btn">Submit Assignment</button>
              </div>
              <div className="assignment-card">
                <h3>Assignment 2: Weather App</h3>
                <p className="due-date">Due: June 15, 2026</p>
                <p>Create a weather app using APIs</p>
                <button className="submit-btn">Submit Assignment</button>
              </div>
            </div>
          </div>
        );
      case 'quiz':
        return (
          <div className="content-section">
            <h2>Quiz Overdue</h2>
            <div className="quiz-list">
              <div className="quiz-card overdue">
                <h3>JavaScript Basics Quiz</h3>
                <p className="overdue-badge">OVERDUE</p>
                <p className="due-date">Was due: June 1, 2026</p>
                <button className="retake-btn">Retake Quiz</button>
              </div>
              <div className="quiz-card overdue">
                <h3>React Fundamentals Quiz</h3>
                <p className="overdue-badge">OVERDUE</p>
                <p className="due-date">Was due: June 2, 2026</p>
                <button className="retake-btn">Retake Quiz</button>
              </div>
            </div>
          </div>
        );
      case 'completed':
        return (
          <div className="content-section">
            <h2>Completed Courses</h2>
            <div className="completed-list">
              <div className="completed-card">
                <h3>HTML Fundamentals</h3>
                <p className="completion-date">Completed on: May 20, 2026</p>
                <p className="grade">Grade: A+</p>
                <button className="review-btn">Review Certificate</button>
              </div>
              <div className="completed-card">
                <h3>CSS Styling</h3>
                <p className="completion-date">Completed on: May 25, 2026</p>
                <p className="grade">Grade: A</p>
                <button className="review-btn">Review Certificate</button>
              </div>
              <div className="completed-card">
                <h3>Introduction to Programming</h3>
                <p className="completion-date">Completed on: May 15, 2026</p>
                <p className="grade">Grade: B+</p>
                <button className="review-btn">Review Certificate</button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Top Navbar - Appears on Hover */}
      <div className="top-navbar">
        <span className="navbar-arrow">&#9654;</span>
        <div className="navbar-content">
          {topNavItems.map((item) => (
            <div key={item.id} className="navbar-item-wrapper">
              <button
                className={`navbar-item${activeTopNav === item.id ? ' navbar-item-active' : ''}`}
                title={item.label}
                onClick={() => handleTopNav(item.id)}
              >
                <span className="navbar-label">{item.label}</span>
                {item.id === 'notification' && unreadCount > 0 && (
                  <span className="navbar-notif-badge">{unreadCount}</span>
                )}
              </button>
            </div>
          ))}
        </div>
        <button className="navbar-theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <img src={logo} alt="Logo" className="navbar-logo" />
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="modal-overlay">
          <div className="video-modal">
            <div className="modal-header">
              <h2>Add Video to {selectedCourse?.title}</h2>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowVideoModal(false);
                  setVideoTitle('');
                  setVideoUrl('');
                  setVideoFile(null);
                }}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              if (videoTitle && (videoUrl || videoFile)) {
                const newVideo = {
                  title: videoTitle,
                  url: videoUrl,
                  file: videoFile ? videoFile.name : null
                };
                setCourses(courses.map(c => 
                  c.id === selectedCourse.id 
                    ? { ...c, videos: [...c.videos, newVideo] }
                    : c
                ));
                setVideoTitle('');
                setVideoUrl('');
                setVideoFile(null);
                setShowVideoModal(false);
              }
            }}>
              <div className="form-group-modal">
                <label>Video Title</label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Enter video title"
                  required
                />
              </div>

              <div className="form-group-modal">
                <label>Video URL</label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://example.com/video.mp4"
                />
              </div>

              <div className="form-group-modal">
                <label>Or Upload Video File</label>
                <label htmlFor="video-file" className="file-upload">
                  <input
                    id="video-file"
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                  />
                  <span>📁 Click to upload or drag & drop</span>
                  {videoFile && <p>✓ {videoFile.name}</p>}
                </label>
              </div>

              <div className="modal-actions">
                <button 
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowVideoModal(false);
                    setVideoTitle('');
                    setVideoUrl('');
                    setVideoFile(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Chat Button */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noreferrer"
        className="floating-wa-btn"
        title="Chat with us on WhatsApp"
      >
        &#128172;
      </a>

      {/* Left Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Student Portal</h2>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => handleSideNav(item.id)}
            >
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
        <button className="admin-btn" onClick={onAdminAccess}>Admin Access</button>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {activeTopNav === 'calendar'
          ? renderFullCalendar()
          : activeTopNav === 'mycourses'
          ? renderMyCourses()
          : activeTopNav === 'session'
          ? renderSession()
          : activeTopNav === 'payment-gateway'
          ? renderPaymentGateway()
          : activeTopNav === 'support'
          ? renderSupport()
          : activeTopNav === 'documents'
          ? renderDocuments()
          : activeTopNav === 'notification'
          ? renderNotifications()
          : activeNav
          ? renderContent()
          : null}
      </main>
    </div>
  );
}

export default Dashboard;
