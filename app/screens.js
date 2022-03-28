import { Navigation } from 'react-native-navigation';
import Login from './components/login';
import Home from './components/home';
import Calendar from './components/calendar';
import Recent from './components/recent';
import Dashboard from './components/dashboard';
import TileMenu from './components/tilemenu';
import MTD from './components/dashboard/mtd';
import YTD from './components/dashboard/ytd';
import Qtd from './components/dashboard/qtd';
import Menu from './components/home/menu';
import Notification from './components/Notification/Notification';

import Create from './components/leads/createLead';
import EditLead from './components/leads/editLead';
import Details from './components/leads/details';
import Leads from './components/leads';
import LeadsBasicInfo from './components/leads/leadsBasicInfo';
import LeadsDocuments from './components/leads/leadsDocuments';
import LeadsAppointments from './components/leads/leadsAppointments';
import FilterScreen from './components/leads/FilterScreen';
import LeadHistory from './components/leads/leadsHistory';
import LeadFiles from './components/leads/leadFiles';
import LeadPhotos from './components/leads/leadPhotos';
import CallDetailsLeads from './components/leads/callDetailsLead';
import LogCallLead from './components/leads//logCallLead';
import ScheduleMeetingLeads from './components/leads/scheduleMeetingLeads';
import MeetingDetailsLeads from './components/leads/meetingDetailsLead';
import CreateTaskLead from './components/leads/createTaskLead';
import TaskDetailsLead from './components/leads/taskDetailsLead';
import TaskDetailsLeads from './components/leads/taskDetailsLead';
import UpdateCallLead from './components/leads/updateCallLead';
import UpdateMeetingLead from './components/leads/updateMeetingLead';
import UpdateTaskLead from './components/leads/updateTaskLead';
import ConvertLead from './components/leads/convert';
import ConvertToContact from './components/leads/convertToContact';
import ConvertToAccount from './components/leads/convertToAccount';
import ConvertToOpportunity from './components/leads/convertToOpportunity';
import AttachmentDetails from "./components/leads/attachments/AttachmentDetails"


import Accounts from './components/accounts';
import CreateAccount from './components/accounts/createAccount';
import AccountDetails from './components/accounts/details';
import Photos from './components/accounts/accountPhotos';
import Files from './components/accounts/accountFiles';
import AccountsOpportunities from './components/accounts/accountsOpportunities';
import AccountsContacts from './components/accounts/accountsContacts';
import AccountsLeads from './components/accounts/accountsLeads';
import CallDetailsAccounts from './components/accounts/callDetailsAccounts';
import MeetingDetailsAccounts from './components/accounts/meetingDetailsAccounts';
import LogCallAccount from './components/accounts/logCallAccount';
import ScheduleMeetingAccount from './components/accounts/scheduleMeetingAccount';
import CreateTaskAccount from './components/accounts/createTaskAccount';
import EditAccount from './components/accounts/editAccount';
import TaskDetailsAccount from './components/accounts/taskDetailsAccount';
import UpdateCallAccount from './components/accounts/updateCallAccount';
import UpdateMeetingAccount from './components/accounts/updateMeetingAccount';
import UpdateTaskAccount from './components/accounts/updateTaskAccount';
import ContactForAccount from './components/accounts/createContactAccount';
import LeadForAccount from './components/accounts/createLeadAccount';
import OpportunityForAccount from './components/accounts/createOpportunityAccount';

import Settings from './components/settings';
import Location from './components/location';
import Daily from './components/calendar/daily';
import Monthly from './components/calendar/monthly';

import CallDetailsCalendar from './components/calendar/callDetailsCalendar';
import MeetingDetailsCalendar from './components/calendar/meetingDetailsCalendar';
import TaskDetailsCalendar from './components/calendar/taskDetailsCalendar';
import CreateCallCalendar from './components/calendar/createCallCalendar';
import CreateMeetingCalendar from './components/calendar/createMeetingCalendar';
import CreateTaskCalendar from './components/calendar/createTaskCalendar';
import EditCallCalendar from './components/calendar/editCallCalendar';
import EditMeetingCalendar from './components/calendar/editMeetingCalendar';
import EditTaskCalendar from './components/calendar/editTaskCalendar';
import Notes from './components/notes';
import CreateNote from "./components/notes/createNote"
import NoteDetails from "./components/notes/details"
import CustomDropdown from './components/custom/customDropdown';
import TopBar from './components/custom/TopBar';

export function registerScreens(store, Provider){

    Navigation.registerComponent('app.AccountsOpportunities', () => AccountsOpportunities, store, Provider);
    Navigation.registerComponent('app.AccountsContacts', () => AccountsContacts, store, Provider);
   
    Navigation.registerComponent('TopBar', () => TopBar, store, Provider);
    Navigation.registerComponent('app.Login', () => Login, store, Provider);
    Navigation.registerComponent('app.Home', () => Home, store, Provider);
    Navigation.registerComponent('app.Calendar', () => Calendar, store, Provider);
    Navigation.registerComponent('app.Recent', () => Recent, store, Provider);
    Navigation.registerComponent('app.Dashboard', () => Dashboard, store, Provider);
    Navigation.registerComponent('app.Leads', () => Leads, store, Provider);
    
    Navigation.registerComponent('app.Settings', () => Settings, store, Provider);
    Navigation.registerComponent('app.Location', () => Location, store, Provider);
    Navigation.registerComponent('app.Details', () => Details, store, Provider); 
    Navigation.registerComponent('app.MTD', () => MTD, store, Provider);
    Navigation.registerComponent('app.YTD', () => YTD, store, Provider);
    Navigation.registerComponent('app.Qtd', () => Qtd, store, Provider);
    Navigation.registerComponent('app.Create', ()=> Create, store, Provider);
    Navigation.registerComponent('app.EditLead', ()=> EditLead, store, Provider);
    Navigation.registerComponent('app.TileMenu', () => TileMenu, store, Provider);
    Navigation.registerComponent('app.Menu', () => Menu, store, Provider);
    Navigation.registerComponent('app.Accounts', () => Accounts, store, Provider);
    Navigation.registerComponent('app.CreateAccount', () => CreateAccount, store, Provider);
    Navigation.registerComponent('app.AccountDetails', () => AccountDetails, store, Provider);

    Navigation.registerComponent('app.Photos', () => Photos, store, Provider);
    Navigation.registerComponent('app.Files', () => Files, store, Provider);
   
   
    Navigation.registerComponent('app.AccountsLeads', () => AccountsLeads, store, Provider);
    Navigation.registerComponent('app.LeadsBasicInfo', () => LeadsBasicInfo, store, Provider);
    Navigation.registerComponent('app.LeadsDocuments', () => LeadsDocuments, store, Provider);
    Navigation.registerComponent('app.LeadsAppointments', () => LeadsAppointments, store, Provider);
    Navigation.registerComponent('app.LeadHistory', () => LeadHistory, store, Provider);
    Navigation.registerComponent('app.LeadFiles', () => LeadFiles, store, Provider);
    Navigation.registerComponent('app.LeadPhotos', () => LeadPhotos, store, Provider);
    Navigation.registerComponent('app.Daily',() => Daily, store, Provider);
    Navigation.registerComponent('app.Monthly',() => Monthly, store, Provider);
    Navigation.registerComponent('app.CallDetailsLeads', () => CallDetailsLeads, store, Provider);
    Navigation.registerComponent('app.LogCallLead', () => LogCallLead, store, Provider);
    Navigation.registerComponent('app.ScheduleMeetingLeads', () => ScheduleMeetingLeads, store, Provider);
    Navigation.registerComponent('app.MeetingDetailsLeads', () => MeetingDetailsLeads, store, Provider);
    Navigation.registerComponent('app.CreateTaskLead', () => CreateTaskLead, store, Provider);
    Navigation.registerComponent('app.TaskDetailsLead', () => TaskDetailsLead, store, Provider);
    Navigation.registerComponent('app.CallDetailsAccounts', () => CallDetailsAccounts, store, Provider);
    Navigation.registerComponent('app.MeetingDetailsAccounts', () => MeetingDetailsAccounts, store, Provider);
    Navigation.registerComponent('app.LogCallAccount', () => LogCallAccount, store, Provider);
    Navigation.registerComponent('app.ScheduleMeetingAccount', () => ScheduleMeetingAccount, store, Provider);
    Navigation.registerComponent('app.CreateTaskAccount', () => CreateTaskAccount, store, Provider);
    Navigation.registerComponent('app.EditAccount', () => EditAccount, store, Provider);
    Navigation.registerComponent('app.TaskDetailsAccount', () => TaskDetailsAccount, store, Provider);
    Navigation.registerComponent('app.UpdateCallAccount', () => UpdateCallAccount, store, Provider);
    Navigation.registerComponent('app.UpdateMeetingAccount', () => UpdateMeetingAccount, store, Provider);
    Navigation.registerComponent('app.UpdateTaskAccount', () => UpdateTaskAccount, store, Provider);
    Navigation.registerComponent('app.TaskDetailsLeads', () => TaskDetailsLeads, store, Provider);
    Navigation.registerComponent('app.UpdateCallLead', () => UpdateCallLead, store, Provider);
    Navigation.registerComponent('app.UpdateMeetingLead', () => UpdateMeetingLead, store, Provider);
    Navigation.registerComponent('app.UpdateTaskLead', () => UpdateTaskLead, store, Provider); 
    Navigation.registerComponent('app.ConvertLead', () => ConvertLead, store, Provider); 
    Navigation.registerComponent('app.ConvertToContact', () => ConvertToContact, store, Provider); 
    Navigation.registerComponent('app.ConvertToAccount', () => ConvertToAccount, store, Provider); 
    Navigation.registerComponent('app.ConvertToOpportunity', () => ConvertToOpportunity, store, Provider); 
    Navigation.registerComponent('app.ContactForAccount', () => ContactForAccount, store, Provider); 
    Navigation.registerComponent('app.LeadForAccount', () => LeadForAccount, store, Provider); 
    Navigation.registerComponent('app.OpportunityForAccount', () => OpportunityForAccount, store, Provider); 
    Navigation.registerComponent('app.CallDetailsCalendar', () => CallDetailsCalendar, store, Provider); 
    Navigation.registerComponent('app.MeetingDetailsCalendar', () => MeetingDetailsCalendar, store, Provider); 
    Navigation.registerComponent('app.TaskDetailsCalendar', () => TaskDetailsCalendar, store, Provider); 
    Navigation.registerComponent('app.CreateCallCalendar', () => CreateCallCalendar, store, Provider); 
    Navigation.registerComponent('app.CreateMeetingCalendar', () => CreateMeetingCalendar, store, Provider); 
    Navigation.registerComponent('app.CreateTaskCalendar', () => CreateTaskCalendar, store, Provider); 
    Navigation.registerComponent('app.EditCallCalendar', () => EditCallCalendar, store, Provider); 
    Navigation.registerComponent('app.EditMeetingCalendar', () => EditMeetingCalendar, store, Provider); 
    Navigation.registerComponent('app.EditTaskCalendar', () => EditTaskCalendar, store, Provider); 
  
    Navigation.registerComponent('app.AttachmentDetails', () => AttachmentDetails, store, Provider); 
   
    Navigation.registerComponent('app.Notes', () => Notes, store, Provider); 
    Navigation.registerComponent('app.CreateNote', () => CreateNote, store, Provider); 
    Navigation.registerComponent('app.NoteDetails', () => NoteDetails, store, Provider); 

    Navigation.registerComponent("app.CustomDropdown", () => CustomDropdown, store, Provider); 
    Navigation.registerComponent("app.Notification", () => Notification, store, Provider); 
    Navigation.registerComponent("app.FilterScreen", () => FilterScreen, store, Provider); 

}
