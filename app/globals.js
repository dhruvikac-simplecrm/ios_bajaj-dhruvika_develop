const React = require("react-native");
import { Linking } from "react-native";

export default {
  RECORD_LIMIT: 50,

  home_url: "https://uatcrm.bajajcapital.com/genericAPI/public/api", //UAT API Path
  demo_instance: "https://uatcrm.bajajcapital.com/", //UAT
  //  home_url: 'https://crm.bajajcapital.com/genericAPI/public/api',////Production API Path
  //  demo_instance: 'https://crm.bajajcapital.com/', //Production

  home: "Home",
  recent: "Recent",
  dashboard: "Dashboard",
  location: "Location",
  settings: "Settings",
  log_out: "Log Out",
  contacts: "Contacts",
  leads: "Leads",
  accounts: "Accounts",
  opportunity: "Opportunities",
  meetings: "Meetings",
  calls: "Calls",
  tasks: "Tasks",
  notes: "Notes",
  users: "Users",
  notes_id: "aa9a3af2-b5a3-4285-a096-5bd6ad112e6a",
  app_name: "SalesMobi",
  load_more: "Load More",
  recent_modules: "Calls,Tasks,Meetings,Leads,Accounts", //'Calls,Tasks,Meetings,Leads,Contacts,Accounts,Opportunities',
  google_api_key: "AIzaSyC0z6lLx4Bm-95qMx1NhyqLZ25wwSNxAXY",
  rupee_sign: "₹",
  login: "Login",

  locations: "locations",
  LOCATION_DISTANCE: "10",
  //Constant tag name
  tagName: "Attachment",
  userPreference: "UserPreferences",
  currencies: "Currencies",
  type_calendar: "Calendar",
  //dashboard strings

  latKey: "jjwg_maps_lat_c",
  longKey: "jjwg_maps_lng_c",

  //daily view strings
  get_activities: "getActivities",
  token_id: "token_id",

  LEADS_FIELDS:
    "id,name,phone_mobile,email1,title,status,category_c,interested_product_c,users_leads_1users_ida,users_leads_1_name,z_webinar_starttime_c",
  LEADS_DETAIL_VIEW_FIELDS:
    "id,first_name,photo,last_name,account_name,lead_customer_type_c,category_c,name,phone_mobile,email1,title,phone_work,phone_other,status,description,primary_address_street,primary_address_city,primary_address_state,primary_address_postalcode,primary_address_country,lead_source,account_name,assigned_user_name,assigned_user_id,date_modified,date_created,jjwg_maps_lat_c,jjwg_maps_lng_c,salutation,middle_name_c,phone_other,interested_product_c,product_sub_category_c,product_sub_category_c_multiselect,designation_c,retirement_date_c,age_in_number_c,phone_home,mode_of_lead_c,lead_type_c,service_type_c,users_leads_1_name,users_leads_1users_ida,users_leads_2_name,users_leads_2users_ida,occupation_type_c,address_1__c,address_2__c,state_c,city_c,postal_code_c,campaign_name,campaign_id,organization_c,disposition_category_c,dispositions_c,client_category_c,prefered_date_time_c_date,prefered_date_time_c_hours,prefered_date_time_c_minutes,prefered_date_time_c_meridiem,appointment_date_time_c_date,appointment_date_time_c_hours,appointment_date_time_c_minutes,appointment_date_time_c_meridiem,remarks_c,meeting_done_c,who_cancelled_c,lost_reason_c,users_leads_1users_ida,users_leads_1_name,z_webinar_starttime_c",

  LEADS_SEARCH_FIELDS: "first_name,last_name",
  LEADS_NOTE_RELATED_FIELDS: "id,name,filename,file_mime_type,date_entered",
  NOTIFICATION_FIELDS:
    "id,name,date_entered,date_modified,assigned_user_id,mobile_notification_status_c,assigned_user_name",
  //Accounts Module = Clients Module

  ACCOUNTS_FIELDS:
    "id,name,phone_mobile,email1,title,website,phone_office,phone_other,status,description,billing_address_street,billing_address_city,billing_address_state,billing_address_postalcode,billing_address_country,annual_revenue,account_type,date_modified,client_code_c,client_fname_c,client_lname_c,scrm_branch_accounts_1_name,scrm_branch_accounts_1scrm_branch_ida,client_category_c,status_c,phone_alternate",
  ACCOUNTS_DETAIL_FIELDS:
    "id,name,phone_mobile,email1,title,website,phone_office,phone_other,status,description,billing_address_street,billing_address_city,billing_address_state,billing_address_postalcode,billing_address_country,annual_revenue,account_type,date_modified,assigned_user_name,assigned_user_id,client_code_c,client_fname_c,client_lname_c,scrm_branch_accounts_1scrm_branch_ida,scrm_branch_accounts_1_name,client_category_c,status_c,phone_alternate,investor_code,rm_code",
  ACCOUNT_SEARCH_FIELDS: "name",

  OPPORTUNITIES_FIELDS:
    "id,name,currency_id,currency_symbol,date_closed,amount,amount_usdollar,opportunity_type,sales_stage,next_step,description,assigned_user_name,assigned_user_id,date_modified",
  OPPORTUNITIES_DETAIL_VIEW_FIELDS:
    "id,name,currency_id,currency_symbol,date_closed,account_name,account_id,amount,amount_usdollar,opportunity_type,sales_stage,next_step,description,assigned_user_name,assigned_user_id",
  OPPORTUNITY_SEARCH_FIELDS: "name",

  CONTACTS_FIELDS:
    "id,first_name,last_name,name,phone_mobile,email1,title,date_modified",
  CONTACTS_DETAIL_VIEW_FIELDS:
    "id,first_name,last_name,name,phone_mobile,email1,title,account_name,account_id,description,phone_work,primary_address_street,primary_address_city,primary_address_state,primary_address_postalcode,primary_address_country,assigned_user_id,assigned_user_name,date_modified",
  search_fields: "first_name,last_name",
  APPOINTMENTS_FIELDS: "id,name,date_entered",
  CALLS_FIELDS:
    "id,name,status,date_start,duration_hours,description,assigned_user_id,assigned_user_name,reminder_time,date_modified,parent_name,parent_id,parent_type,process_type_c,dispostion_c,sub_disposition_c",
  MEETINGS_FIELDS:
    "id,name,status,date_start,duration_hours,description,location,reminder_time,assigned_user_id,assigned_user_name,date_modified,parent_id,parent_type,parent_name",
  TASKS_FIELDS:
    "id,name,status,date_start,date_due,priority,reminder_c,date_completed_c,type_c,estimated_effort_c,effort_c,description,assigned_user_id,assigned_user_name,parent_id,parent_type,parent_name",
  CURRENCIES_FIELDS: "id,name,symbol,conversion_rate,status,iso4217",
  //name,phone_mobile,email1,title,phone_office,status
  NOTES_FIELDS:
    "id,name,description,filename,file_mime_type,parent_type,date_modified,date_entered",
  NOTES_SEARCH_FIELDS: "name,description",
  LOCATION_FIELDS: "id,first_name,last_name,jjwg_maps_lat_c,jjwg_maps_lng_c",

  //these status' are the parameters for the appointment and the history api
  HISTORY_STATUS:
    "Held,Not Held,Completed,Deferred,Missed,In Limbo,Pending Input",
  APPOINTMENT_STATUS: "Planned,In Progress,Not Started",

  label_start_date_time: "Start Date & Time",
  label_due_date_time: "Due Date & Time",
  label_related_to: "Related to",
  label_relate_to: "Relate to",
  fontFamily: {
    //fontFamily: 'OpenSans-Regular'
  },
  colors: {
    grey: "#9e9e9e",
    light_grey: "#DCDCDC",
    color_primary: "#01579B",
    color_primary_light: "#9901579B",
    color_primary_dark: "#004175",
    color_accent: "#ea2c32",
    blue_default: "#1870ff",
    faint_blue: "#94bcfc",
    red_bajaj: "#ea2c32",
    black: "#000",
    white: "#fff",
    red: "#FF0000",
  },

  lead_status_color: {
    new: "#F68F66", //'#fec500', //open
    assigned: "#4ED0E0", //'#ffff00', //Duplicate Lead
    inprocess: "#A3897C", //'#8cc700', //Existing Client
    recycled: "#7687CD", //'#0064b5', //CSO Allocated
    rm_allocated: "#9DA7D8",
    converted: "#40956A", //'#0fad00', //Converted

    dead: "#BF5151", //'#0010a5' //lost
    appointed: "#69CA84", //Appointment
    follow_up: "#F8CC4F", //Follow Up
    cross_sell: "#C89DCF", //Cross Sell
  },

  oppotunity_sales_stage_color: {
    prospecting: "#ff6600",
    qualification: "#ff6600",
    needs_analysis: "#ff6600",
    value_proposition: "#ff9400",
    decision_makers: "#fec500",
    perception_analysis: "#fec500",
    proposal: "#ffff00",
    negotiation: "#8cc700",
    closed_won: "#0fad00",
    closed_lost: "#0010a5",
  },

  tile_menu: {
    dashboard: "DASHBOARD",
    recent: "RECENT",
    leads: "LEADS",
    contacts: "CONTACTS",
    accounts: "CLIENTS", //'ACCOUNTS',
    opportunities: "OPPORTUNITIES",
    location: "LOCATION",
    settings: "SETTINGS",
    calendar: "CALENDAR",
  },

  app_messages: {
    //for contacts
    contact_list_message: "Contacts synced successfully",
    contact_create_message: "Contact created successfully",
    contact_update_message: "Contact updated successfully",
    contact_deleted_message: "Contact deleted successfully",
    //for accounts
    account_list_message: "Clients synced successfully",
    account_create_message: "Account created successfully",
    account_update_message: "Account updated sucessfully",
    account_deleted_message: "Account deleted successfully",
    account_converted_message: "Converted to Account",
    //for leads
    lead_list_message: "Leads synced successfully",
    lead_create_message: "Lead created successfully",
    lead_update_message: "Lead updated successfully",
    lead_deleted_message: "Lead deleted successfully",
    //for opportunities
    opportunity_list_message: "Opportunities synced successfully",
    opportunity_create_message: "Opportunity created successfully",
    opportunity_update_message: "Opportunity updated successfully",
    opportunity_deleted_message: "Opportunity deleted successfully",
    //for calls
    call_list_message: "Calls synced successfully",
    call_create_message: "Call created succesfully",
    call_update_message: "Call updated successfully",
    call_deleted_message: "Call deleted successfully",
    //for meetings
    meeting_list_message: "Meetings synced successfully",
    meeting_create_message: "Meeting created successfully",
    meeting_update_message: "Meeting updated successfully",
    meeting_deleted_message: "Metting deleted successfully",
    //for tasks
    task_list_message: "Tasks synced successfully",
    task_create_message: "Task created Successfully",
    task_update_message: "Task updated successfully",
    task_deleted_message: "Task deleted successfully",
    //for appointments
    appointment_list_message: "Appointments synced successfully",
    //Error messages
    token_expired:
      "Your session has been expired! Please login again to continue",
    error_message: "Unable to get the correct response",
    error_string: "Message", //'Error
    //warning message
    warning_delete_contact: "Are you sure you want to delete this contact?",
    warning_delete_account: "Are you sure you want to delete this account?",
    warning_delete_lead: "Are you sure you want to delete this lead?",
    warning_delete_opporunity:
      "Are you sure you want to delete this opportunity?",
    warning_delete_call: "Are you sure you want to delete this call?",
    warning_delete_meeting: "Are you sure you want to delete this meeting?",
    warning_delete_task: "Are you sure you want to delete this task?",
  },

  apiErrorCodes: {
    ECODE_TOKEN_EXPIRED: 11,
    ECODE_ACCESS_DENIED: 40,
  },

  missing_texts: {
    email_missing: "email is missing",
    phone_missing: "phone no is missing",
    name: "name is missing",
    website_missing: "website is missing",
    title_missing: "title is missing",
    amount_missing: "amount is missing",
    date_missing: "date is missing",
    product_interested_missing: "product interested is missing",
  },

  leadStatusItems: [
    { value: "New" },
    { value: "Assigned" },
    { value: "In Process" },
    { value: "Converted" },
    { value: "Recycled" },
    { value: "Dead" },
  ],

  lead_status_array: [
    "New",
    "Assigned",
    "In Process",
    "Converted",
    "Recycled",
    "Dead",
  ],

  leadSourceItems: [
    { value: "Existing Customer", label: "Existing Customer" },
    { value: "Self Generated", label: "Self Generated" },
    { value: "Partner", label: "Partner" },
    { value: "LinkedIn", label: "Linked In" },
    { value: "Employee", label: "Employee" },
    { value: "Cold Call", label: "Cold Call" },
    { value: "Public Relations", label: "Public Relations" },
    { value: "Direct Mail", label: "Direct Mail" },
    { value: "Conference", label: "Conference" },
    { value: "Trade Show", label: "Trade Show" },
    { value: "Web Site", label: "Web Site" },
    { value: "Word of mouth", label: "Word of mouth" },
    { value: "Email", label: "Email" },
    { value: "Campaign", label: "Campaign" },
    { value: "IndiaMART", label: "IndiaMART" },
    { value: "JustDial", label: "JustDial" },
    { value: "ChatBot", label: "ChatBot" },
  ],

  leadStatusArray: [
    { value: "New", label: "New" },
    { value: "Assigned", label: "Assigned" },
    { value: "In Process", label: "In Process" },
    { value: "Converted", label: "Converted" },
    { value: "Recycled", label: "Recycled" },
    { value: "Dead", label: "Dead" },
  ],

  leadCustomerTypeItems: [
    { value: "Individual", label: "Individual" },
    { value: "Corporate", label: "Corporate" },
  ],

  leadCategoryItems: [
    { value: "Warm", label: "Warm" },
    { value: "Cold", label: "Cold" },
    { value: "Hot", label: "Hot" },
  ],

  //contacts module dropdown items
  contactAccountItems: [
    { value: "Analyst" },
    { value: "Competitor" },
    { value: "Customer" },
    { value: "Integrator" },
    { value: "Investor" },
    { value: "Partner" },
    { value: "Press" },
    { value: "Prospect" },
    { value: "Reseller" },
    { value: "Other" },
  ],

  salesStageItems: [
    { label: "Prospecting", value: "Prospecting" },
    { label: "Qualification", value: "Qualification" },
    { label: "Need Analysis", value: "Need Analysis" },
    { label: "Value Proposition", value: "Value Proposition" },
    { label: "Id. Decision Makers", value: "Id. Decision Makers" },
    { label: "Perception Analysis", value: "Perception Analysis" },
    { label: "Proposal/Price Quote", value: "Proposal/Price Quote" },
    { label: "Negotiation/Review", value: "Negotiation/Review" },
    { label: "Closed Won", value: "Closed Won" },
    { label: "Closed Lost", value: "Closed Lost" },
  ],

  businessTypeItems: [
    { label: "Existing Business", value: "Existing Business" },
    { label: "New Business", value: "New Business" },
  ],

  emptyItems: [{ label: "", value: "" }],

  leadItems: [
    { label: "", value: "" },
    { label: "Lead1", value: "Lead1" },
    { label: "Lead2", value: "Lead2" },
    { label: "Lead3", value: "Lead3" },
    { label: "Lead4", value: "Lead4" },
  ],

  contactItems: [
    { label: "", value: "" },
    { label: "Contact1", value: "Contact1" },
    { label: "Contact2", value: "Contact2" },
    { label: "Contact3", value: "Contact3" },
    { label: "Contact4", value: "Contact4" },
  ],

  accountItems: [
    { label: "", value: "" },
    { label: "Account1", value: "Account1" },
    { label: "Account2", value: "Account2" },
    { label: "Account3", value: "Account3" },
    { label: "Account4", value: "Account4" },
  ],

  opportunityItems: [
    { label: "", value: "" },
    { label: "Opportunity1", value: "Opportunity1" },
    { label: "Opportunity2", value: "Opportunity2" },
    { label: "Opportunity3", value: "Opportunity3" },
    { label: "Opportunity4", value: "Opportunity4" },
  ],

  relateToItems: [
    { label: "Leads", value: "Leads" },
    { label: "Clients", value: "Accounts" },
    // { label: "Contacts", value: "Contacts" },
    // { label: "Opportunities", value: "Opportunities" }
  ],

  validateEmail(email) {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  },

  validateMobile(mobile) {
    var re = /^\(?([0-9]{3})\)?([0-9]{3})([0-9]{4})$/;
    return re.test(String(mobile));
  },

  validateAmount(amount) {
    var reg = /^\d+$/;
    return reg.test(String(amount));
  },

  formatMoney(n, c, d, t) {
    var c = isNaN((c = Math.abs(c))) ? 2 : c,
      d = d == undefined ? "." : d,
      t = t == undefined ? "," : t,
      s = n < 0 ? "-" : "",
      i = String(parseInt((n = Math.abs(Number(n) || 0).toFixed(c)))),
      j = (j = i.length) > 3 ? j % 3 : 0;

    return (
      s +
      (j ? i.substr(0, j) + t : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
      (c
        ? d +
          Math.abs(n - i)
            .toFixed(c)
            .slice(2)
        : "")
    );
    // var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    // return toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
  },

  formatDate(date) {
    //June, July, Sept : all months name in 3 chars
    var monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    if (date != undefined && date != null) {
      const array = date.split("-");
      const day = array[2];

      //this is for the month
      if (array[1] === "01" || array[1] === "1") {
        var monthIndex = 0;
      } else if (array[1] === "02" || array[1] === "2") {
        var monthIndex = 1;
      } else if (array[1] === "03" || array[1] === "3") {
        var monthIndex = 2;
      } else if (array[1] === "04" || array[1] === "4") {
        var monthIndex = 3;
      } else if (array[1] === "05" || array[1] === "5") {
        var monthIndex = 4;
      } else if (array[1] === "06" || array[1] === "6") {
        var monthIndex = 5;
      } else if (array[1] === "07" || array[1] === "7") {
        var monthIndex = 6;
      } else if (array[1] === "08" || array[1] === "8") {
        var monthIndex = 7;
      } else if (array[1] === "09" || array[1] === "9") {
        var monthIndex = 8;
      } else if (array[1] === "10") {
        var monthIndex = 9;
      } else if (array[1] === "11") {
        var monthIndex = 10;
      } else if (array[1] === "12") {
        var monthIndex = 11;
      }

      const year = array[0];

      return monthNames[monthIndex] + " " + day + ", " + year;
    } else {
      return;
    }
  },

  stringSeparator(str) {
    var array = str.split(" ");
    var due = array[0];
    return due;
  },

  reFormatDateToSendOnServer(dateString) {
    //New formated date & time should be=> 'yyyy-mm-dd HH:mm:ss'
    Number.prototype.padLeft = function (base, chr) {
      var len = String(base || 10).length - String(this).length + 1;
      return len > 0 ? new Array(len).join(chr || "0") + this : this;
    };
    console.log("before: ", dateString); //this date should be sent with API
    var d = new Date(dateString),
      dformat =
        [
          d.getUTCFullYear(),
          (d.getUTCMonth() + 1).padLeft(),
          d.getUTCDate().padLeft(),
        ].join("-") +
        " " +
        [
          d.getUTCHours().padLeft(),
          d.getUTCMinutes().padLeft(),
          d.getUTCSeconds().padLeft(),
        ].join(":");

    console.log("reformatted: ", dformat); //this date should be sent with API
    return dformat;
  },

  getFormatedTime(dateString) {
    const formattedDateString = this.formatUtcDateAndTimeToLocal(dateString);
    const array = formattedDateString.split(" ");
    console.log("getFormatedTime: array = " + array);
    if (array != undefined && array.length > 4) {
      return array[3] + " " + array[4];
    }
    return formattedDateString;
  },

  formatTimeString(timeString) {
    const timeArray = timeString.split(":");
    var hours = timeArray[0];
    var minutes = timeArray[1];
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes.length < 2 ? "0" + minutes : minutes;
    const strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  },
  dateFromNow(str) {
    console.log("dateFromNow: str = " + str);
    let utcDate = str.replace(" ", "T");
    utcDate = utcDate + "Z";
    const date = new Date(utcDate);
    const currentDate = new Date();
    if (
      date.getUTCDate() === currentDate.getUTCDate() &&
      date.getUTCMonth() === currentDate.getUTCMonth() &&
      date.getUTCFullYear() === currentDate.getUTCFullYear()
    ) {
      const hours = Math.floor(Math.abs(date - currentDate) / 36e5);

      if (hours === 0) {
        const minutes = Math.round(
          ((Math.abs(date - currentDate) % 86400000) % 3600000) / 60000
        );
        return minutes <= 1 ? "A while ago" : `${minutes} minutes ago.`;
      } else {
        return `${Math.floor(hours)} hours ago`;
      }
    } else {
      const oneDay =24*60* 60 * 1000;
      const diffDays = Math.round(Math.abs((date - currentDate) / oneDay));

      if (diffDays >= 360) {
        return Math.floor(diffDays / 360) == 1
          ? `${Math.floor(diffDays / 365)} year ago`
          : `${Math.floor(diffDays / 365)} years ago`;
      } else if (diffDays >= 30) {
        return Math.floor(diffDays / 30) == 1
          ? `${Math.floor(diffDays / 30)} month ago`
          : `${Math.floor(diffDays / 30)} months ago`;
      } else if (diffDays < 30) {
        return diffDays == 1 || diffDays == 0
          ? `${diffDays} day ago`
          : `${diffDays} days ago`;
      }
    }
  },
  formatUtcDateAndTimeToLocal(str) {
    console.log("formatUtcDateAndTimeToLocal: str = " + str);
    if (str === undefined || str === "" || str === null) {
      return str;
    }

    //The server date is in UTC format, show it in user's local and redable format
    let utcDate = str.replace(" ", "T");
    utcDate = utcDate + "Z";

    const serverDate = new Date(utcDate);
    const utc = serverDate.toISOString();
    const local = serverDate.toString();

    const year = serverDate.getFullYear();
    const month =
      (serverDate.getMonth() + 1).toString().length === 1
        ? "0" + (serverDate.getMonth() + 1)
        : serverDate.getMonth() + 1;
    const day =
      serverDate.getDate().toString().length === 1
        ? "0" + serverDate.getDate()
        : serverDate.getDate();

    const hours =
      serverDate.getHours().toString().length === 1
        ? "0" + serverDate.getHours()
        : serverDate.getHours();
    const minutes =
      serverDate.getMinutes().toString().length === 1
        ? "0" + serverDate.getMinutes()
        : serverDate.getMinutes();
    const seconds =
      serverDate.getSeconds().toString().length === 1
        ? "0" + serverDate.getSeconds()
        : serverDate.getSeconds();

    const newDate = year + "-" + month + "-" + day;
    const newTime = hours + ":" + minutes + ":" + seconds;

    const formattedDate =
      this.formatDate(newDate) + " " + this.formatTimeString(newTime);
    return formattedDate;
  },

  formatDateAndTime(str) {
    console.log("formatDateAndTime: str = " + str);
    if (str === undefined || str === "" || str === null) {
      return str;
    }
    const array = str.split(" ");
    const date = array[0];
    const time = array[1];

    const formattedDate =
      this.formatDate(date) + " " + this.formatTimeString(time);
    console.log("formatDateAndTime: formattedDate = " + formattedDate);

    return formattedDate;
  },

  formatCurrentDate() {
    Number.prototype.padLeft = function (base, chr) {
      const len = String(base || 10).length - String(this).length + 1;
      return len > 0 ? new Array(len).join(chr || "0") + this : this;
    };
    const d = new Date();
    dformat =
      [
        d.getFullYear(),
        (d.getMonth() + 1).padLeft(),
        d.getDate().padLeft(),
      ].join("-") +
      " " +
      [
        d.getHours().padLeft(),
        d.getMinutes().padLeft(),
        d.getSeconds().padLeft(),
      ].join(":");

    return dformat;
  },

  formatTime(dates) {
    let date = new Date(dates);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  },

  /**
   * Newly added method this returns proper date and time format of current date
   */
  formatCurrentDateAndTime() {
    //Format Type : MMM DD, YYYY h:mm a
    Number.prototype.padLeft = function (base, chr) {
      var len = String(base || 10).length - String(this).length + 1;
      return len > 0 ? new Array(len).join(chr || "0") + this : this;
    };
    var d = new Date();
    dformat = [
      d.getFullYear(),
      (d.getMonth() + 1).padLeft(),
      d.getDate().padLeft(),
    ].join("-");

    var formattedDate =
      this.formatDate(dformat) + " " + this.formatTime(d.getTime());

    return formattedDate;
  },

  DEFAULT_FORMAT: "MMM DD, YYYY h:mm a",
  DEFAULT_FORMAT_DATE_ONLY: "MMM DD, YYYY",

  makeAPhoneCall(phoneNumber) {
    Linking.openURL(`tel:${phoneNumber}`);
  },

  openURL(url) {
    Linking.openURL(url);
  },

  openMailClient(email) {
    Linking.openURL("mailto:" + email);
  },

  convertToBase64(url) {
    // Create Base64 Object
    var Base64 = {
      _keyStr:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
      encode: function (e) {
        var t = "";
        var n, r, i, s, o, u, a;
        var f = 0;
        e = Base64._utf8_encode(e);
        while (f < e.length) {
          n = e.charCodeAt(f++);
          r = e.charCodeAt(f++);
          i = e.charCodeAt(f++);
          s = n >> 2;
          o = ((n & 3) << 4) | (r >> 4);
          u = ((r & 15) << 2) | (i >> 6);
          a = i & 63;
          if (isNaN(r)) {
            u = a = 64;
          } else if (isNaN(i)) {
            a = 64;
          }
          t =
            t +
            this._keyStr.charAt(s) +
            this._keyStr.charAt(o) +
            this._keyStr.charAt(u) +
            this._keyStr.charAt(a);
        }
        return t;
      },
      decode: function (e) {
        var t = "";
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (f < e.length) {
          s = this._keyStr.indexOf(e.charAt(f++));
          o = this._keyStr.indexOf(e.charAt(f++));
          u = this._keyStr.indexOf(e.charAt(f++));
          a = this._keyStr.indexOf(e.charAt(f++));
          n = (s << 2) | (o >> 4);
          r = ((o & 15) << 4) | (u >> 2);
          i = ((u & 3) << 6) | a;
          t = t + String.fromCharCode(n);
          if (u != 64) {
            t = t + String.fromCharCode(r);
          }
          if (a != 64) {
            t = t + String.fromCharCode(i);
          }
        }
        t = Base64._utf8_decode(t);
        return t;
      },
      _utf8_encode: function (e) {
        e = e.replace(/\r\n/g, "\n");
        var t = "";
        for (var n = 0; n < e.length; n++) {
          var r = e.charCodeAt(n);
          if (r < 128) {
            t += String.fromCharCode(r);
          } else if (r > 127 && r < 2048) {
            t += String.fromCharCode((r >> 6) | 192);
            t += String.fromCharCode((r & 63) | 128);
          } else {
            t += String.fromCharCode((r >> 12) | 224);
            t += String.fromCharCode(((r >> 6) & 63) | 128);
            t += String.fromCharCode((r & 63) | 128);
          }
        }
        return t;
      },
      _utf8_decode: function (e) {
        var t = "";
        var n = 0;
        var r = (c1 = c2 = 0);
        while (n < e.length) {
          r = e.charCodeAt(n);
          if (r < 128) {
            t += String.fromCharCode(r);
            n++;
          } else if (r > 191 && r < 224) {
            c2 = e.charCodeAt(n + 1);
            t += String.fromCharCode(((r & 31) << 6) | (c2 & 63));
            n += 2;
          } else {
            c2 = e.charCodeAt(n + 1);
            c3 = e.charCodeAt(n + 2);
            t += String.fromCharCode(
              ((r & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
            );
            n += 3;
          }
        }
        return t;
      },
    };
    // Encode the String
    var encodedString = Base64.encode(url);
    console.log("result ", encodedString);
    return encodedString;
  },

  decodeFromBase64(url) {
    // Create Base64 Object
    var Base64 = {
      _keyStr:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
      encode: function (e) {
        var t = "";
        var n, r, i, s, o, u, a;
        var f = 0;
        e = Base64._utf8_encode(e);
        while (f < e.length) {
          n = e.charCodeAt(f++);
          r = e.charCodeAt(f++);
          i = e.charCodeAt(f++);
          s = n >> 2;
          o = ((n & 3) << 4) | (r >> 4);
          u = ((r & 15) << 2) | (i >> 6);
          a = i & 63;
          if (isNaN(r)) {
            u = a = 64;
          } else if (isNaN(i)) {
            a = 64;
          }
          t =
            t +
            this._keyStr.charAt(s) +
            this._keyStr.charAt(o) +
            this._keyStr.charAt(u) +
            this._keyStr.charAt(a);
        }
        return t;
      },
      decode: function (e) {
        var t = "";
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (f < e.length) {
          s = this._keyStr.indexOf(e.charAt(f++));
          o = this._keyStr.indexOf(e.charAt(f++));
          u = this._keyStr.indexOf(e.charAt(f++));
          a = this._keyStr.indexOf(e.charAt(f++));
          n = (s << 2) | (o >> 4);
          r = ((o & 15) << 4) | (u >> 2);
          i = ((u & 3) << 6) | a;
          t = t + String.fromCharCode(n);
          if (u != 64) {
            t = t + String.fromCharCode(r);
          }
          if (a != 64) {
            t = t + String.fromCharCode(i);
          }
        }
        t = Base64._utf8_decode(t);
        return t;
      },
      _utf8_encode: function (e) {
        e = e.replace(/\r\n/g, "\n");
        var t = "";
        for (var n = 0; n < e.length; n++) {
          var r = e.charCodeAt(n);
          if (r < 128) {
            t += String.fromCharCode(r);
          } else if (r > 127 && r < 2048) {
            t += String.fromCharCode((r >> 6) | 192);
            t += String.fromCharCode((r & 63) | 128);
          } else {
            t += String.fromCharCode((r >> 12) | 224);
            t += String.fromCharCode(((r >> 6) & 63) | 128);
            t += String.fromCharCode((r & 63) | 128);
          }
        }
        return t;
      },
      _utf8_decode: function (e) {
        var t = "";
        var n = 0;
        var r = (c1 = c2 = 0);
        while (n < e.length) {
          r = e.charCodeAt(n);
          if (r < 128) {
            t += String.fromCharCode(r);
            n++;
          } else if (r > 191 && r < 224) {
            c2 = e.charCodeAt(n + 1);
            t += String.fromCharCode(((r & 31) << 6) | (c2 & 63));
            n += 2;
          } else {
            c2 = e.charCodeAt(n + 1);
            c3 = e.charCodeAt(n + 2);
            t += String.fromCharCode(
              ((r & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
            );
            n += 3;
          }
        }
        return t;
      },
    };
    // Encode the String
    var encodedString = Base64.decode("U29uYWxAIyEqc2ltcHBsZSQl");
    console.log("decodeFromBase64: result ", encodedString);
    return encodedString;
  },

  validateText(text) {
    const specialChars = [];
    return this.checkIfMatchesWithSpecialChars(false, specialChars, text);
  },

  checkIfMatchesWithSpecialChars(isAlphanumeric, specialChars, text) {
    const lastChar = text.substr(text.length - 1);
    console.log("Last char is = " + lastChar);
    let isSChar = false;
    const lowerAlphaChars = Array.from(Array(26), (e, i) =>
      String.fromCharCode(i + 97)
    );
    const upperAlphaChars = Array.from(Array(26).keys(), (i) =>
      String.fromCharCode(i + 65)
    );
    const numberChars = Array.from(Array(10).keys(), (i) =>
      String.fromCharCode(i + 48)
    );

    let charsArray = [...lowerAlphaChars, ...upperAlphaChars, ...specialChars];
    if (isAlphanumeric) {
      charsArray = [
        ...lowerAlphaChars,
        ...upperAlphaChars,
        ...numberChars,
        ...specialChars,
      ];
    }

    for (let index = 0; index < charsArray.length; index++) {
      const element = charsArray[index];
      console.log("IN looop: element = " + element + " lastChar = " + lastChar);
      if (lastChar == element) {
        console.log("EQUAL");
        isSChar = true;
        break;
      }
    }

    return isSChar;
  },
};
