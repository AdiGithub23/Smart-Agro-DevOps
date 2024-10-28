import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import SignUp from "./pages/SignUp.js";
import AdminSLT from "./pages/AdminSlt/AdminSLT.js"; //admin slt
import AdminSLTAdd from "./pages/AdminSlt/AdminSLTAdd.js";
import AdminSLTEdit from "./pages/AdminSlt/AdminSLTEdit.js";
import AdminSLTDashboard from "./pages/AdminSlt/AdminSLTDashboard.js";
import AdminSLTUser from "./pages/AdminSlt/AdminSLTUser.js";
import AdminSLTMessage from "./pages/AdminSlt/AdminSLTMessage.js";
import AdminSLTDevices from "./pages/AdminSlt/AdminSLTDevices.js";
import AdminSLTInventry from "./pages/AdminSlt/AdminSLTInventry.js";
import AdminSLTPackage from "./pages/AdminSlt/AdminSLTPackage.js";
import AdminSltRecomandation from "./pages/AdminSlt/AdminSLTRecomendation.js";
import AdminSLTDistrictSelection from "./pages/AdminSlt/AdminSLTDistrictSelection.js";
import SuperAdmin from "./pages/SuperAdmin/SuperAdmin.js"; //superadmin
import SuperAdminAdd from "./pages/SuperAdmin/SuperAdminAdd.js";
import SuperAdminEdit from "./pages/SuperAdmin/SuperAdminEdit.js";
import SuperAdminUser from "./pages/SuperAdmin/SuperAdminUser.js";
import CustomerAdmin from "./pages/CustomerAdmin/CustomerAdmin.js"; //customeradmin
import CustomerAdminAdd from "./pages/CustomerAdmin/CustomerAdminAdd.js";
import CustomerAdminEdit from "./pages/CustomerAdmin/CustomerAdminEdit.js";
import AdminCoustomerDashboard from "./pages/CustomerAdmin/AdminCoustomerDashboard.js";
import AdminCustomerAlerts from "./pages/CustomerAdmin/AdminCustomerAlerts.js";
import CustomerAdminYield from "./pages/CustomerAdmin/CustomerAdminYield.js";
import AdminCustomerRealTime from "./pages/CustomerAdmin/AdminCustomerRealTime.js.js";
import AdminCustomerDevice from "./pages/CustomerAdmin/AdminCustomerDevice.js";
import AdminCustomerAnalysis from "./pages/CustomerAdmin/AdminCustomerAnalysis.js";
import CustomerAdminUser from "./pages/CustomerAdmin/CustomerAdminUsers.js";
import CustomerAdminFarms from "./pages/CustomerAdmin/CustomerAdminFarms.js";
import CustomerAdminMessage from "./pages/CustomerAdmin/CustomerAdminMessages.js";
import AdminCustomerRecomandations from "./pages/CustomerAdmin/AdminCustomerRecomenation.js";
import AdminCustomerDistrictSelection from "./pages/CustomerAdmin/AdminCustomerDistrictSelection.js";
import Manager from "./pages/Manager/Manager.js";
import ManagerYield from "./pages/Manager/ManagerYield.js";
import ManagerAlerts from "./pages/Manager/ManagerAlerts.js";
import ManagerDevices from "./pages/Manager/ManagerDevices.js";
import ManagerDashboard from "./pages/Manager/ManagerDashbord.js";
import ManagerMessages from "./pages/Manager/ManagerMessages.js";
import ManagerRealTime from "./pages/Manager/ManagerRealTime.js";
import ManagerAnalysis from "./pages/Manager/ManagerAnalysis.js";
import DevicesRealTime from "./pages/Devices/DevicesRealTime.js";
import DevicesAnalysis from "./pages/Devices/DevicesAnalysis.js";
import ManagerRecomandation from "./pages/Manager/ManagerRecomendation.js";
import ManagerDistrictSelection from "./pages/Manager/ManagerDistrictSelection.js";
import DevicesAlert from "./pages/Devices/DevicesAlert.js";
import DevicesYeild from "./pages/Devices/DevicesYield.js";
import ForgetPassword from "./pages/FogetPassword.js";
import ChangePassword from "./pages/PasswordChange.js";
import {ProtectedRoute, ValidationProtectedRoute} from "./Components/ProtectedRoutes.js";
import NavBar6 from "./Components/NavBar6.js";
import NavBar7 from "./Components/NavBar7.js";

const CustomerAdminLayout = ({ children }) => (
  <>
    <NavBar7 />
    {children}
  </>
);




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/signup"
          element={<ValidationProtectedRoute element={<SignUp />} />}
        />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/register" element={<Register />} />

        {/*---------------AdminSlt-------------------------*/}
        
        <Route path="/adminslt" element={<ProtectedRoute element={AdminSLT} roles={['slt-admin']} />} />
        <Route path="/adminsltadd" element={<ProtectedRoute element={AdminSLTAdd} roles={['slt-admin']} />} />
        <Route path="/adminsltedit" element={<ProtectedRoute element={AdminSLTEdit} roles={['slt-admin']} />} />
        <Route path="/adminsltdashboard" element={<ProtectedRoute element={AdminSLTDashboard} roles={['slt-admin']} />} />
        <Route path="/adminsltuser" element={<ProtectedRoute element={AdminSLTUser} roles={['slt-admin']} />} />
        <Route path="/adminsltmessages" element={<ProtectedRoute element={AdminSLTMessage} roles={['slt-admin']} />} />
        <Route path="/adminsltdevices" element={<ProtectedRoute element={AdminSLTDevices} roles={['slt-admin']} />} />
        <Route path="/adminsltinventry" element={<ProtectedRoute element={AdminSLTInventry} roles={['slt-admin']} />} />
        <Route path="/adminsltpackage" element={<ProtectedRoute element={AdminSLTPackage} roles={['slt-admin']} />} />
        <Route path="/adminsltrecomendations" element={<ProtectedRoute element={AdminSltRecomandation} roles={['slt-admin']} />} />
        <Route path="/adminsltdistrictselection" element={<ProtectedRoute element={AdminSLTDistrictSelection} roles={['slt-admin']} />} />  
        <Route path="/adminsltedit/:userId" element={<ProtectedRoute element={AdminSLTEdit} roles={['slt-admin']} />} />
        
        {/*---------------CustomerAdmin-------------------------*/}

        <Route path="/customeradmin" element={<CustomerAdminLayout><ProtectedRoute element={CustomerAdmin} roles={['customer-admin']} /></CustomerAdminLayout>}/>
        <Route path="/admincoustomerdashboard" element={<CustomerAdminLayout><ProtectedRoute element={AdminCoustomerDashboard} roles={['customer-admin']} /></CustomerAdminLayout>} />
        <Route path="/admincustomerrealtime" element={<CustomerAdminLayout><ProtectedRoute element={AdminCustomerRealTime} roles={['customer-admin']} /> </CustomerAdminLayout>} />
        <Route path="/admincustomerdevices" element={<CustomerAdminLayout><ProtectedRoute element={AdminCustomerDevice} roles={['customer-admin']} /></CustomerAdminLayout>} />
        <Route path="/customeradminyield" element={<CustomerAdminLayout><ProtectedRoute element={CustomerAdminYield} roles={['customer-admin']} /></CustomerAdminLayout>} />
        <Route path="/customeradminuser" element={<CustomerAdminLayout><ProtectedRoute element={CustomerAdminUser} roles={['customer-admin']} /></CustomerAdminLayout>} />
        <Route path="/customeradminfarms" element={<CustomerAdminLayout><ProtectedRoute element={CustomerAdminFarms} roles={['customer-admin']} /></CustomerAdminLayout>} />
        <Route path="/customeradminmessages" element={<CustomerAdminLayout><ProtectedRoute element={CustomerAdminMessage} roles={['customer-admin']} /></CustomerAdminLayout>} />
        <Route path="/admincoustomeranalysis" element={<CustomerAdminLayout><ProtectedRoute element={AdminCustomerAnalysis} roles={['customer-admin']} /></CustomerAdminLayout>} />
        <Route path="/customeradminadd" element={<CustomerAdminLayout><ProtectedRoute element={CustomerAdminAdd} roles={['customer-admin']} /></CustomerAdminLayout>} />
        <Route path="/customeradminedit/:userId" element={<CustomerAdminLayout><ProtectedRoute element={CustomerAdminEdit} roles={['customer-admin']} /></CustomerAdminLayout>} />
        <Route path="/admincustomeralerts" element={<CustomerAdminLayout><ProtectedRoute element={AdminCustomerAlerts} roles={['customer-admin']} /></CustomerAdminLayout>} />
        <Route path="/admincustomeralerts/:deviceName" element={<CustomerAdminLayout><ProtectedRoute element={AdminCustomerAlerts} roles={['customer-admin']} /></CustomerAdminLayout>} />
        <Route path="/customeradminmessage" element={<CustomerAdminLayout><ProtectedRoute element={CustomerAdminMessage} roles={['customer-admin']} /></CustomerAdminLayout>} />
        <Route path="/customeradmindistrictselection" element={<CustomerAdminLayout><ProtectedRoute element={AdminCustomerDistrictSelection} roles={['customer-admin']} /></CustomerAdminLayout>} />
        <Route path="/admincustomerrecomendation" element={<CustomerAdminLayout><ProtectedRoute element={AdminCustomerRecomandations} roles={['customer-admin']} /></CustomerAdminLayout>} />
        

        {/*---------------SuperAdmin-------------------------*/}
        
        <Route path="/superadmin" element={<ProtectedRoute element={SuperAdmin} roles={['super-admin']} />} />
        <Route path="/superadminadd" element={<ProtectedRoute element={SuperAdminAdd} roles={['super-admin']} />} />
        <Route path="/superadminedit" element={<ProtectedRoute element={SuperAdminEdit} roles={['super-admin']} />} />
        <Route path="/superadminuser" element={<ProtectedRoute element={SuperAdminUser} roles={['super-admin']} />} />
        <Route path="/superAdminedit/:userId" element={<ProtectedRoute element={SuperAdminEdit} roles={['super-admin']} />} />
        

        {/*-----------------Manager-------------------------------------- */}
        <Route element={<NavBar6 />}>
          <Route path="/manager" element={<ProtectedRoute element={Manager} roles={['customer-manager']} />} />
          <Route path="/manageryield" element={<ProtectedRoute element={ManagerYield} roles={['customer-manager']} />} />
          <Route path="/manageralerts" element={<ProtectedRoute element={ManagerAlerts} roles={['customer-manager']} />} />
          <Route path="/managerdevices" element={<ProtectedRoute element={ManagerDevices} roles={['customer-manager']} />} />
          <Route path="/managermessages" element={<ProtectedRoute element={ManagerMessages} roles={['customer-manager']} />} />
          <Route path="/managerdashboard" element={<ProtectedRoute element={ManagerDashboard} roles={['customer-manager']} />} />
          <Route path="/managerrealtime" element={<ProtectedRoute element={ManagerRealTime} roles={['customer-manager']} />} />
          <Route path="/manageranalysis" element={<ProtectedRoute element={ManagerAnalysis} roles={['customer-manager']} />} />
          <Route path="/managerrecomandation" element={<ProtectedRoute element={ManagerRecomandation} roles={['customer-manager']} />} />
          <Route path="/managerdistrictselection" element={<ProtectedRoute element={ManagerDistrictSelection} roles={['customer-manager']} />} />
          <Route path="/manageralerts/:deviceName" element={<ProtectedRoute element={ManagerAlerts} roles={['customer-manager']} />} />
          </Route>

        {/*-----------------Devices-------------------------------------------------- */}

        
        <Route path="/devicesalert/:deviceId" element={<ProtectedRoute element={DevicesAlert} roles={['slt-admin']} />} />
        <Route path="/devicesyield/:deviceId" element={<ProtectedRoute element={DevicesYeild} roles={['slt-admin']} />} />
        <Route path="/devicesrealtime/:deviceId" element={<ProtectedRoute element={DevicesRealTime} roles={['slt-admin']} />} />
        <Route path="/devicesanalysis/:deviceId" element={<ProtectedRoute element={DevicesAnalysis} roles={['slt-admin']} />} />
        
      </Routes>
    </Router>
  );
}

export default App;
