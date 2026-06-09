import React, { useState } from 'react';
import './App.css';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import AdminPage from './AdminPage';
import CustomCursor from './CustomCursor';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'light';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('app-theme', nextTheme);
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [loginRecords, setLoginRecords] = useState([]);
  const [adminUploadedVideos, setAdminUploadedVideos] = useState({});
  const [calendarLinks, setCalendarLinks] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [adminCourses, setAdminCourses] = useState([
    { id: 1, title: 'AutoCAD Mechanical', description: 'Master AutoCAD for mechanical design and drafting', dept: 'Mech' },
    { id: 2, title: 'Autodesk Inventor Course', description: 'Learn 3D mechanical design with Autodesk Inventor', dept: 'Mech' },
    { id: 3, title: 'Wiring Harness Design Course', description: 'Design and develop wiring harness systems', dept: 'Mech' },
    { id: 4, title: '3D Printing & Prototyping', description: 'Explore additive manufacturing and rapid prototyping', dept: 'Mech' },
    { id: 5, title: 'SolidWorks Masterclass', description: 'Complete SolidWorks 3D modelling and simulation', dept: 'Mech' },
    { id: 6, title: 'Creo Parametric Course', description: 'Parametric modelling and design with Creo', dept: 'Mech' },
    { id: 7, title: 'CATIA V5 Course', description: 'Advanced surface and solid modelling with CATIA V5', dept: 'Mech' },
    { id: 8, title: 'ANSYS Simulation Course', description: 'Finite element analysis and simulation with ANSYS', dept: 'Mech' },
    { id: 9, title: 'HyperMesh Course', description: 'Pre-processing and meshing with HyperMesh', dept: 'Mech' },
    { id: 10, title: 'ANSA Pre-Processing Course', description: 'Advanced pre-processing using ANSA', dept: 'Mech' },
    { id: 11, title: 'Computational Fluid Dynamics (CFD)', description: 'CFD analysis and simulation techniques', dept: 'Mech' },
    { id: 12, title: 'NX CAD (Unigraphics) Course', description: 'Product design and engineering with NX CAD', dept: 'Mech' },
    { id: 13, title: 'Civil CAD', description: 'AutoCAD for civil engineering drawings and design', dept: 'Civil' },
    { id: 14, title: 'Revit Architecture', description: 'BIM-based architectural design with Revit', dept: 'Civil' },
    { id: 15, title: 'SketchUp for Civil Engineering', description: '3D modelling and visualization for civil projects', dept: 'Civil' },
    { id: 16, title: 'STAAD.Pro', description: 'Structural analysis and design using STAAD.Pro', dept: 'Civil' },
    { id: 17, title: 'BIM Professional', description: 'Building Information Modelling for construction professionals', dept: 'Civil' },
    { id: 18, title: 'Fullstack Web Development', description: 'Build complete web apps with frontend and backend technologies', dept: 'CSC/IT' },
    { id: 19, title: 'Python Programming', description: 'Learn Python from basics to advanced applications', dept: 'CSC/IT' },
    { id: 20, title: 'Java Programming', description: 'Core and advanced Java programming concepts', dept: 'CSC/IT' },
    { id: 21, title: 'Software Testing', description: 'Manual and automation testing techniques', dept: 'CSC/IT' },
    { id: 22, title: 'Data Analytics', description: 'Data analysis, visualization and business insights', dept: 'CSC/IT' },
    { id: 23, title: 'Digital Marketing', description: 'SEO, social media, and online marketing strategies', dept: 'CSC/IT' },
    { id: 24, title: 'UI/UX Design', description: 'User interface and experience design principles', dept: 'CSC/IT' },
    { id: 25, title: 'Graphics Design', description: 'Creative graphic design using industry-standard tools', dept: 'Arts' },
    { id: 26, title: 'Video Editing', description: 'Professional video editing and post-production techniques', dept: 'Arts' },
    { id: 27, title: 'Digital Marketing', description: 'SEO, social media and online marketing for creatives', dept: 'Arts' },
    { id: 28, title: 'MS Office', description: 'Word, Excel, PowerPoint and Office productivity tools', dept: 'Arts' },
    { id: 29, title: 'Tally with GST', description: 'Accounting and GST filing using Tally software', dept: 'Arts' },
    { id: 30, title: 'Scratch Programming', description: 'Learn coding basics through fun Scratch projects', dept: 'Kids' },
    { id: 31, title: 'Robotics Basics', description: 'Introduction to robotics, sensors and simple machines', dept: 'Kids' },
    { id: 32, title: 'AI Basics for Kids', description: 'Fun and simple introduction to artificial intelligence', dept: 'Kids' },
    { id: 33, title: 'Computer Fundamentals', description: 'Basic computer skills and digital literacy for kids', dept: 'Kids' },
  ]);
  const [users, setUsers] = useState([]);

  const removeUser = (id) => setUsers(prev => prev.filter(u => u.id !== id));

  const addNotification = (msg, type) => {
    setNotifications(prev => [{ id: Date.now(), msg, type, time: new Date().toLocaleTimeString() }, ...prev]);
  };

  const handleLogin = (credentials) => {
    const email = typeof credentials === 'string' ? credentials : credentials.email;
    setIsLoggedIn(true);
    setIsAdminView(false);
    // Record login
    const timestamp = new Date().toLocaleString();
    setLoginRecords([...loginRecords, {
      email,
      password: credentials.password,
      userType: 'Student',
      timestamp,
      ipAddress: 'N/A'
    }]);
  };

  const handleAdminAccess = () => {
    setIsAdminView(true);
    setIsLoggedIn(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdminView(false);
  };

  const handleAdminLogin = () => {
    // Record admin login
    const timestamp = new Date().toLocaleString();
    setLoginRecords([...loginRecords, {
      email: 'admin123@gmail.com',
      userType: 'Admin',
      timestamp,
      ipAddress: 'N/A'
    }]);
  };

  return (
    <div className={`App ${theme}-theme`}>
      <CustomCursor />
      {isAdminView ? (
        <AdminPage onLogout={handleLogout} loginData={loginRecords} adminVideos={adminUploadedVideos} setAdminVideos={setAdminUploadedVideos} calendarLinks={calendarLinks} setCalendarLinks={setCalendarLinks} addNotification={addNotification} adminCourses={adminCourses} setAdminCourses={setAdminCourses} users={users} removeUser={removeUser} studentCredentials={loginRecords[loginRecords.length - 1]} onAdminLogin={handleAdminLogin} theme={theme} toggleTheme={toggleTheme} />
      ) : isLoggedIn ? (
        <Dashboard onLogout={handleLogout} onAdminAccess={handleAdminAccess} adminVideos={adminUploadedVideos} calendarLinks={calendarLinks} notifications={notifications} adminCourses={adminCourses} theme={theme} toggleTheme={toggleTheme} />
      ) : (
        <LoginPage onLogin={handleLogin} onAdminAccess={handleAdminAccess} theme={theme} toggleTheme={toggleTheme} />
      )}
    </div>
  );
}

export default App;
