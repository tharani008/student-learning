import React, { useState } from 'react';
import './AdminPage.css';

function AdminPage({ onLogout, loginData, adminVideos = {}, setAdminVideos = () => {}, calendarLinks = {}, setCalendarLinks = () => {}, addNotification = () => {}, adminCourses = [], setAdminCourses = () => {}, users = [], removeUser = () => {}, studentCredentials, onAdminLogin = () => {} }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [linkDate, setLinkDate] = useState('');
  const [linkLabel, setLinkLabel] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCourseDept, setNewCourseDept] = useState('Mech');

  const ADMIN_EMAIL = 'admin123@gmail.com';
  const ADMIN_PASSWORD = 'admin@12345';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Check against hardcoded admin credentials
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        setLoading(false);
        setIsLoggedIn(true);
        setEmail('');
        setPassword('');
        onAdminLogin();
      } else if (studentCredentials && email === studentCredentials.email && password === studentCredentials.password) {
        // Also allow login with student credentials from login page
        setLoading(false);
        setIsLoggedIn(true);
        setEmail('');
        setPassword('');
        onAdminLogin();
      } else {
        setLoading(false);
        setError('Invalid email or password');
      }
    }, 1000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    setError('');
    onLogout();
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-box">
          <h1 className="admin-title">Admin Portal</h1>
          <p className="admin-subtitle">Administrator Access Only</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Admin Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Admin Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="admin-login-btn" disabled={loading}>
              {loading ? 'Authenticating...' : 'Admin Login'}
            </button>
          </form>
          <div className="admin-footer">
            <button className="back-btn" onClick={onLogout}>← Back to Login</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="admin-nav">
          <button 
            className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            Courses
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'logins' ? 'active' : ''}`}
            onClick={() => setActiveTab('logins')}
          >
            Login Records
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            Calendar Links
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </nav>
        <button className="admin-logout-btn" onClick={handleLogout}>
          Logout Admin
        </button>
      </aside>

      <main className="admin-main-content">
        <header className="admin-header">
          <h1>Admin Dashboard</h1>
          <p className="welcome-text">Welcome, Administrator</p>
        </header>

        <div className="admin-content">
          {activeTab === 'dashboard' && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-info">
                    <p className="stat-label">Total Users</p>
                    <p className="stat-value">0</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-info">
                    <p className="stat-label">Active Courses</p>
                    <p className="stat-value">0</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-info">
                    <p className="stat-label">Completed Courses</p>
                    <p className="stat-value">0</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-info">
                    <p className="stat-label">Assignments</p>
                    <p className="stat-value">0</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'logins' && (
            <div className="admin-tables">
              <div className="table-section">
                <h2>Admin & User Login Records</h2>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Login ID</th>
                      <th>Email</th>
                      <th>User Type</th>
                      <th>Login Time</th>
                      <th>IP Address</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginData && loginData.length > 0 ? (
                      loginData.map((login, index) => (
                        <tr key={index}>
                          <td>#{String(index + 1).padStart(3, '0')}</td>
                          <td>{login.email}</td>
                          <td><span className="badge-type">{login.userType}</span></td>
                          <td>{login.timestamp}</td>
                          <td>{login.ipAddress || 'N/A'}</td>
                          <td><span className="status-badge active">Success</span></td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', color: '#999' }}>No login records found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="admin-tables">
              <div className="table-section">
                <h2>User Management</h2>
                {users.length === 0 ? (
                  <p style={{ color: '#6a8fa8', fontSize: '14px' }}>No users found.</p>
                ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Enrollment Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user.id}>
                        <td>#{String(index + 1).padStart(3, '0')}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.enrolled}</td>
                        <td>
                          <button className="cal-delete-btn" onClick={() => removeUser(user.id)}>Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                )}
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="admin-courses-section">

              {/* Add New Course */}
              <div className="video-upload-box">
                <h3>Add New Course</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (newCourseTitle.trim()) {
                    const newCourse = { id: Date.now(), title: newCourseTitle.trim(), description: newCourseDesc.trim(), dept: newCourseDept };
                    setAdminCourses(prev => [...prev, newCourse]);
                    addNotification(`New course "${newCourseTitle.trim()}" added`, 'video');
                    setNewCourseTitle('');
                    setNewCourseDesc('');
                    setNewCourseDept('Mech');
                  }
                }}>
                  <div className="form-group">
                    <label>Course Title</label>
                    <input type="text" value={newCourseTitle} onChange={e => setNewCourseTitle(e.target.value)} placeholder="e.g. Python for Beginners" required />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <input type="text" value={newCourseDesc} onChange={e => setNewCourseDesc(e.target.value)} placeholder="Short course description" />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <select value={newCourseDept} onChange={e => setNewCourseDept(e.target.value)} className="course-select">
                      <option>Mech</option>
                      <option>Civil</option>
                      <option>CSC/IT</option>
                      <option>Arts</option>
                      <option>Kids</option>
                    </select>
                  </div>
                  <button type="submit" className="upload-video-btn">Add Course</button>
                </form>
              </div>

              {/* Courses grouped by Department with inline video upload */}
              {['Mech', 'Civil', 'CSC/IT', 'Arts', 'Kids'].map(dept => {
                const deptCourses = adminCourses.filter(c => c.dept === dept);
                return (
                  <div key={dept} className="admin-tables">
                    <div className="table-section">
                      <h2>{dept}</h2>
                      {deptCourses.length === 0 ? (
                        <p style={{ color: '#6a8fa8', fontSize: '13px' }}>No courses under {dept} yet.</p>
                      ) : (
                        <div className="course-upload-list">
                          {deptCourses.map(c => (
                            <div key={c.id} className="course-upload-item">
                              <div className="course-upload-header">
                                <div>
                                  <span className="course-upload-title">{c.title}</span>
                                  <span className="badge-type" style={{ marginLeft: '10px' }}>{adminVideos[c.id]?.length || 0} videos</span>
                                </div>
                                <button className="cal-delete-btn" onClick={() => {
                                  setAdminCourses(prev => prev.filter(x => x.id !== c.id));
                                  const updated = { ...adminVideos };
                                  delete updated[c.id];
                                  setAdminVideos(updated);
                                }}>Remove</button>
                              </div>

                              {/* Inline video upload */}
                              <div className="course-upload-form">
                                <form onSubmit={(e) => {
                                  e.preventDefault();
                                  const titleInput = e.target.elements[`vt-${c.id}`];
                                  const urlInput = e.target.elements[`vu-${c.id}`];
                                  const fileInput = e.target.elements[`vf-${c.id}`];
                                  const title = titleInput.value.trim();
                                  const url = urlInput.value.trim();
                                  const file = fileInput.files[0];
                                  if (title && (url || file)) {
                                    const newVideo = { title, url, file: file ? file.name : null };
                                    const updated = { ...adminVideos };
                                    updated[c.id] = [...(updated[c.id] || []), newVideo];
                                    setAdminVideos(updated);
                                    addNotification(`New video "${title}" added to ${c.title}`, 'video');
                                    titleInput.value = '';
                                    urlInput.value = '';
                                    fileInput.value = '';
                                  }
                                }}>
                                  <div className="course-upload-fields">
                                    <input name={`vt-${c.id}`} type="text" placeholder="Video title" required />
                                    <input name={`vu-${c.id}`} type="url" placeholder="Video URL (optional)" />
                                    <input name={`vf-${c.id}`} type="file" accept="video/*" />
                                    <button type="submit" className="upload-video-btn" style={{ whiteSpace: 'nowrap' }}>Upload</button>
                                  </div>
                                </form>

                                {/* Uploaded videos list */}
                                {adminVideos[c.id]?.length > 0 && (
                                  <div className="uploaded-videos-list">
                                    {adminVideos[c.id].map((v, idx) => (
                                      <div key={idx} className="uploaded-video-row">
                                        <span>{v.title}</span>
                                        {v.url && <span className="video-source">[Online]</span>}
                                        {v.file && <span className="video-source">[File]</span>}
                                        <button className="cal-delete-btn" style={{ marginLeft: 'auto' }} onClick={() => {
                                          const updated = { ...adminVideos };
                                          updated[c.id] = updated[c.id].filter((_, i) => i !== idx);
                                          setAdminVideos(updated);
                                        }}>Remove</button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="admin-tables">
              <div className="table-section">
                <h2>Add Link to Calendar Date</h2>
                <form className="cal-link-form" onSubmit={(e) => {
                  e.preventDefault();
                  if (linkDate && linkLabel && linkUrl) {
                    const updated = { ...calendarLinks };
                    updated[linkDate] = [...(updated[linkDate] || []), { label: linkLabel, url: linkUrl }];
                    setCalendarLinks(updated);
                    addNotification(`New calendar link "${linkLabel}" added on ${linkDate}`, 'calendar');
                    setLinkLabel('');
                    setLinkUrl('');
                    setLinkDate('');
                  }
                }}>
                  <div className="form-group">
                    <label>Date</label>
                    <input type="date" value={linkDate} onChange={e => setLinkDate(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Link Label</label>
                    <input type="text" value={linkLabel} onChange={e => setLinkLabel(e.target.value)} placeholder="e.g. React Live Class" required />
                  </div>
                  <div className="form-group">
                    <label>URL</label>
                    <input type="url" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://meet.example.com/..." required />
                  </div>
                  <button type="submit" className="upload-video-btn">Add Link</button>
                </form>

                {Object.keys(calendarLinks).length > 0 && (
                  <div className="cal-links-list">
                    <h3>Existing Calendar Links</h3>
                    <table className="admin-table">
                      <thead><tr><th>Date</th><th>Label</th><th>URL</th><th>Action</th></tr></thead>
                      <tbody>
                        {Object.entries(calendarLinks).flatMap(([date, links]) =>
                          links.map((link, idx) => (
                            <tr key={`${date}-${idx}`}>
                              <td>{date}</td>
                              <td>{link.label}</td>
                              <td><a href={link.url} target="_blank" rel="noreferrer" className="cal-link-preview">{link.url}</a></td>
                              <td>
                                <button className="cal-delete-btn" onClick={() => {
                                  const updated = { ...calendarLinks };
                                  updated[date] = updated[date].filter((_, i) => i !== idx);
                                  if (updated[date].length === 0) delete updated[date];
                                  setCalendarLinks(updated);
                                }}>Remove</button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="admin-tables">
              <div className="table-section">
                <h2>Admin Settings</h2>
                <div className="settings-content">
                  <div className="setting-item">
                    <h3>System Settings</h3>
                    <label>
                      <input type="checkbox" defaultChecked /> Enable User Registration
                    </label>
                    <label>
                      <input type="checkbox" defaultChecked /> Email Notifications
                    </label>
                    <label>
                      <input type="checkbox" /> Maintenance Mode
                    </label>
                  </div>
                  <div className="setting-item">
                    <h3>Security Settings</h3>
                    <label>
                      <input type="checkbox" defaultChecked /> Two-Factor Authentication
                    </label>
                    <label>
                      <input type="checkbox" defaultChecked /> Login Activity Logging
                    </label>
                  </div>
                  <button className="save-settings-btn">Save Settings</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminPage;
