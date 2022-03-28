export default {
    capChar : "^",   
    appointments:{
        calls_duration:[ { label:"15 Minutes", value:"0:15" },
        { label:"30 Minutes", value:"0:30" },
        { label:"45 Minutes", value:"0:45" },
        { label:"1 Hour", value:"1:00" },
        { label:"1 Hour & 15 Minutes", value:"1:15" },
        { label:"1 Hour & 30 Minutes", value:"1:30" },
        { label:"1 Hour & 45 Minutes", value:"1:45" },
        { label:"2 Hours", value:"2:00" },
        { label:"2 Hour & 15 Minutes", value:"2:15" },
        { label:"2 Hour & 30 Minutes", value:"2:30" },
        { label:"2 Hour & 45 Minutes", value:"2:45" },
        { label:"3 Hours", value:"3:00" }],
      
        calls_status: [{ label: "Planned", value: "Planned" },
        { label: "Held", value: "Held" },
        { label: "Not Held", value: "Not Held" },
        { label: "Missed", value: "Missed" },
        { label: "In Limbo", value: "In Limbo" }],

        calls_direction:[{ label: "Inbound", value: "Inbound" },
        { label: "Outbound", value: "Outbound" }],

        calls_reminder:[
        {label:"1 Minute Prior", value:"60"},
        {label:"5 Minute Prior", value:"300"},
        {label:"10 Minute Prior", value:"600"},
        {label:"15 Minute Prior", value:"900"},
        {label:"30 Minute Prior", value:"1800"},
        {label:"1 Hour Prior", value:"3600"},
        {label:"2 Hours Prior", value:"7200"},
        {label:"3 Hours Prior", value:"10800"},
        {label:"5 Hours Prior", value:"18000"},
        {label:"1 Day Prior", value:"86400"}
       ],

       
        meetings_status: [{ label: "Planned", value: "Planned" },
        { label: "Held", value: "Held" },
        { label: "Not Held", value: "Not Held" }],

        meetings_duration:[
            {label: 'None', value: ''},
            { label:"15 Minutes", value:"0:15"},
            { label:"30 Minutes", value:"0:30"},
            { label:"45 Minutes", value:"0:45"},
            { label:"1 Hour", value:"1:00"},
            { label:"1 Hours & 30 Minutes", value:"1:30"},
            { label:"2 Hours", value:"2:00"},
            { label:"3 Hours", value:"3:00"},
            { label:"6 Hours", value:"6:00"},
            { label:"1 Day", value:"24:00"},
    ],
    
    meetings_reminder:[
        {label:"1 Minute Prior", value:"60"},
        {label:"5 Minute Prior", value:"300"},
        {label:"10 Minute Prior", value:"600"},
        {label:"15 Minute Prior", value:"900"},
        {label:"30 Minute Prior", value:"1800"},
        {label:"1 Hour Prior", value:"3600"},
        {label:"2 Hours Prior", value:"7200"},
        {label:"3 Hours Prior", value:"10800"},
        {label:"5 Hours Prior", value:"18000"},
        {label:"1 Day Prior", value:"86400"}
       ],

    tasks_priority:[  {label:"Medium", value:"Medium" },
    {label:"High", value:"High" },
    {label:"Low", value:"Low" },],
       
    tasks_status:[{ label:"Not Started", value:"Not Started" },
       { label:"In Progress", value:"In Progress" },
       { label:"Completed", value:"Completed" },
       { label:"Pending Input", value:"Pending Input" },
       { label:"Deffered", value:"Deffered" } ],

    tasks_reminder:[
        {label:"1 Minute Prior", value:"60"},
        {label:"5 Minute Prior", value:"300"},
        {label:"10 Minute Prior", value:"600"},
        {label:"15 Minute Prior", value:"900"},
        {label:"30 Minute Prior", value:"1800"},
        {label:"1 Hour Prior", value:"3600"},
        {label:"2 Hours Prior", value:"7200"},
        {label:"3 Hours Prior", value:"10800"},
        {label:"5 Hours Prior", value:"18000"},
        {label:"1 Day Prior", value:"86400"}
       ],
    },
    
   
} 
