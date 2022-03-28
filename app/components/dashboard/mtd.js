import React, { Component } from 'react';
import {
    View,
    ScrollView,
    ActivityIndicator,
    Alert
} from 'react-native';
import { connect } from 'react-redux';

import { Card, Text } from 'native-base';
import { login, updateToken } from '../../actions/auth';
import { logout } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import styles from './style';
import PieChart from 'react-native-pie-chart';
import globals from '../../globals';
import apiCallForToken from '../../controller/ApiCallForToken';

var CallArray = new Array();
var MeetingArray = new Array();
var TaskArray = new Array();
var LeadsArray = new Array();
var OpportunityArray = new Array();

class MTD extends Component {

    constructor(props) {
        super(props);
        this.mounted = false;
        this.state = {
            username: '',
            password: '',
            call_loading: true,
            meeting_loading: true,
            task_loading: true,
            lead_loading: true,
            opportunity_loading: true

        }
    }

    componentDidMount = () => {
        this.mounted = true;

        this.getCalls();
        this.getMeetings();
        this.getTasks();
        this.getLeads();
    }

    componentWillUnmount() {
        this.mounted = false;
        // controller.abort()

    }
    getCalls() {

        // const signal = controller.signal

        let url = globals.home_url + "/chart" + "?token_id=" + this.props.token +
            "&module_name=" + globals.calls + "&user_id=" + this.props.assigned_user_id +
            "&period=this_month" + "&field_name=status"
            + "&url=" + this.props.url;

        console.log(url);

        fetch(url, {
            method: "GET",
            // signal: signal,
            dataType: 'jsonp',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },

        })
            .then((response) => {
                return response.json() // << This is the problem
            })
            .then((response) => {
                console.log("getCalls")

                if (this.mounted) {
                    console.log(response);
                    if (response.success === true) {

                        CallArray[0] = response.data.result.status.Planned;
                        CallArray[1] = response.data.result.status.Held;
                        CallArray[2] = response.data.result.status.Not_Held;

                        console.log('Array of status');
                        console.log(CallArray);

                        this.setState({
                            call_loading: false
                        })

                    } else if (response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {


                        apiCallForToken.getToken(this.props).then(token => {
                            console.log("getToken: token = " + token)
                            if (token == null) {
                                this.setState({ call_loading: false });
                                return;
                            }
                            //get the call details, after session generated
                            this.getCalls()
                        }).catch(error => {
                            console.log("getToken: error = " + error)
                            this.setState({ call_loading: false });
                        })


                    } else {
                        this.setState({ call_loading: false });

                    }

                }
            })
            .catch((error) => {
                if (this.mounted) {
                    this.setState({
                        call_loading: false
                    })
                    console.log(error);
                }
            });


    }

    //get meetings
    getMeetings() {
        // const signal = controller.signal


        let url = globals.home_url + "/chart" + "?token_id=" + this.props.token +
            "&module_name=" + globals.meetings + "&user_id=" + this.props.assigned_user_id +
            "&period=this_month" + "&field_name=status"
            + "&url=" + this.props.url;

        console.log(url);

        fetch(url, {
            method: "GET",
            // signal: signal,
            dataType: 'jsonp',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },

        })
            .then((response) => {
                return response.json() // << This is the problem
            })
            .then((response) => {
                console.log("getMeetings")

                if (this.mounted) {

                    console.log(response);
                    if (response.success === true) {

                        MeetingArray[0] = response.data.result.status.Planned;
                        MeetingArray[1] = response.data.result.status.Held;
                        MeetingArray[2] = response.data.result.status.Not_Held;

                        console.log('Array of meeting');
                        console.log(MeetingArray);

                        this.setState({
                            meeting_loading: false
                        })

                    } else {
                        this.setState({
                            meeting_loading: false
                        })
                    }

                }
            })
            .catch((error) => {
                if (this.mounted) {

                    this.setState({
                        meeting_loading: false
                    })
                    console.log(error);
                }
            });


    }


    //tasks
    getTasks() {
        // const signal = controller.signal

        let url = globals.home_url + "/chart" + "?token_id=" + this.props.token +
            "&module_name=" + globals.tasks + "&user_id=" + this.props.assigned_user_id +
            "&period=this_month" + "&field_name=status"
            + "&url=" + this.props.url;

        console.log(url);

        fetch(url, {
            method: "GET",
            // signal: signal,
            dataType: 'jsonp',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },

        })
            .then((response) => {
                return response.json() // << This is the problem
            })
            .then((response) => {
                console.log("getTasks")

                if (this.mounted) {

                    console.log(response);
                    if (response.success === true) {

                        TaskArray[0] = response.data.result.status.Not_Started;
                        TaskArray[1] = response.data.result.status.In_Progress;
                        TaskArray[2] = response.data.result.status.Completed;
                        TaskArray[3] = response.data.result.status.Pending_Input;
                        TaskArray[4] = response.data.result.status.Deferred;



                        console.log('Array of task');
                        console.log(TaskArray);

                        this.setState({
                            task_loading: false
                        })

                    } else {
                        this.setState({
                            task_loading: false
                        })
                    }
                }
            })
            .catch((error) => {
                if (this.mounted) {

                    this.setState({
                        task_loading: false
                    })
                    console.error(error);
                }
            });
    }


    //leads
    getLeads() {
        // const signal = controller.signal

        let url = globals.home_url + "/chart" + "?token_id=" + this.props.token +
            "&module_name=" + globals.leads + "&user_id=" + this.props.assigned_user_id +
            "&period=this_month" + "&field_name=status"
            + "&url=" + this.props.url;

        console.log(url);

        fetch(url, {
            method: "GET",
            // signal: signal,
            dataType: 'jsonp',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },

        })
            .then((response) => {
                return response.json() // << This is the problem
            })
            .then((response) => {
                console.log("getLeads")
                if (this.mounted) {

                    console.log(response);
                    if (response.success === true) {



                        let i = 0;
                        Object.keys(response.data.result.status).forEach(function (key) {
                            let statusValue = response.data.result.status[key];
                            console.log(key + ':' + statusValue);
                            if (key != '') {
                                LeadsArray[i] = statusValue
                                i++;
                            }
                        });

                        console.log('Array of leads');
                        console.log(LeadsArray);

                        this.setState({
                            lead_loading: false
                        })

                    } else {
                        this.setState({
                            lead_loading: false
                        })
                    }
                }
            })
            .catch((error) => {
                if (this.mounted) {

                    this.setState({
                        lead_loading: false
                    })
                    console.error(error);
                }
            });

    }

    getOpportunities() {
        // const signal = controller.signal

        let url = globals.home_url + "/chart" + "?token_id=" + this.props.token +
            "&module_name=" + globals.opportunity + "&user_id=" + this.props.assigned_user_id +
            "&period=this_month" + "&field_name=sales_stage"
            + "&url=" + this.props.url;

        console.log(url);

        fetch(url, {
            method: "GET",
            // signal: signal,
            dataType: 'jsonp',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },

        })
            .then((response) => {
                return response.json() // << This is the problem
            })
            .then((response) => {
                if (this.mounted) {

                    console.log(response);
                    if (response.success === true) {

                        OpportunityArray[0] = response.data.result.status.Prospecting != undefined ? response.data.result.status.Prospecting : 0;
                        OpportunityArray[1] = response.data.result.status.Qualification != undefined ? response.data.result.status.Qualification : 0;
                        OpportunityArray[2] = response.data.result.status.Needs_Analysis != undefined ? response.data.result.status.Needs_Analysis : 0;
                        OpportunityArray[3] = response.data.result.status.Value_Proposition != undefined ? response.data.result.status.Value_Proposition : 0;
                        OpportunityArray[4] = response.data.result.status.Identifying_Decision_Makers != undefined ? response.data.result.status.Identifying_Decision_Makers : 0;
                        OpportunityArray[5] = response.data.result.status.Perception_Analysis != undefined ? response.data.result.status.Perception_Analysis : 0;
                        OpportunityArray[6] = response.data.result.status.Proposal_Price_Quote != undefined ? response.data.result.status.Proposal_Price_Quote : 0;
                        OpportunityArray[7] = response.data.result.status.Negotiation_Review != undefined ? response.data.result.status.Negotiation_Review : 0;
                        OpportunityArray[8] = response.data.result.status.Closed_Won != undefined ? response.data.result.status.Closed_Won : 0;
                        OpportunityArray[9] = response.data.result.status.Closed_Lost != undefined ? response.data.result.status.Closed_Lost : 0;

                        console.log('Array of leads');
                        console.log(OpportunityArray);

                        this.setState({
                            opportunity_loading: false
                        })

                    } else {
                        this.setState({
                            opportunity_loading: false
                        })
                    }
                }
            })
            .catch((error) => {
                if (this.mounted) {

                    this.setState({
                        opportunity_loading: false
                    })
                    console.log(error);
                }
            });

    }



    render() {

        const activity_chart_wh = 90
        const opportunity_chart_wh = 175
        const series = [13, 12, 12]


        const sliceColor = ['#ff9600', '#009e00', '#a8009d']
        const tasksColor = ['#ff9600', '#009e00', '#a8009d', '#4328b2', '#0099cc']
        const leadsColor = ['#F68F66', '#4ED0E0', '#A3897C', '#7687CD', '#9DA7D8', '#40956A', '#BF5151', '#69CA84', '#F8CC4F', '#C89DCF']//['#ed1900', '#ff9700', '#009e00', '#4328b2', '#a8009d', '#0098cb']
        const opportunity_color = ['#dc3a2f', '#f3993e', '#459724', '#9a359a', '#3b3eac', '#3b9ac7', '#dd4477', '#66aa2c', '#b82e2e', '#316395']

        return (

            <ScrollView >

                <View style={{ backgroundColor: '#dfdfdf', flexDirection: 'column', marginTop: 0, marginLeft: 2, marginRight: 2 }} >

                    <Card>


                        <View style={{ alignItems: 'flex-start', height: 210, padding: 0, flex: 1, flexDirection: 'row' }} >


                            <View style={{ flex: 1, alignItems: 'center', flexDirection: 'column' }} >

                                <Text style={styles.text}>Calls</Text>

                                {

                                    (!this.state.call_loading)
                                        ?
                                        (


                                            <View>

                                                {

                                                    (CallArray[0] === 0 &&
                                                        CallArray[1] === 0 &&
                                                        CallArray[2] === 0)
                                                        ?
                                                        (


                                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                                                                <Text style={{ fontSize: 12, color: 'grey' }}>No Calls</Text>
                                                            </View>

                                                        )
                                                        :
                                                        (
                                                            <PieChart
                                                                style={styles.pie}
                                                                chart_wh={activity_chart_wh}
                                                                series={CallArray}
                                                                doughnut={true}
                                                                sliceColor={sliceColor}
                                                            />
                                                        )
                                                }

                                                {
                                                    !CallArray[0] == 0 &&
                                                    <View style={{ flexDirection: 'row', marginTop: 20 }} >
                                                        <View style={{ width: 8, height: 8, backgroundColor: '#ff9600' }} />
                                                        <Text style={{ fontSize: 8, marginLeft: 5 }}>Planned({CallArray[0]})</Text>
                                                    </View>
                                                }

                                                {
                                                    CallArray[1] !== 0 &&
                                                    <View style={{ flexDirection: 'row', marginTop: 5 }} >
                                                        <View style={{ width: 8, height: 8, backgroundColor: '#009e00' }} />
                                                        <Text style={{ fontSize: 8, marginLeft: 5 }}>Held({CallArray[1]})</Text>
                                                    </View>

                                                }

                                                {
                                                    CallArray[2] !== 0 &&
                                                    <View style={{ flexDirection: 'row', marginTop: 5 }} >
                                                        <View style={{ width: 8, height: 8, backgroundColor: '#a8009d' }} />
                                                        <Text style={{ fontSize: 8, marginLeft: 5 }}>Not Held({CallArray[2]})</Text>
                                                    </View>

                                                }









                                            </View>
                                        ) :
                                        (

                                            <View style={{ flexDirection: 'column', justifyContent: 'center', flex: 1, height: null }}>
                                                <ActivityIndicator color="red" size="small" />
                                            </View>
                                        )
                                }

                            </View>

                            <View style={{ flex: 1, alignItems: 'center', flexDirection: 'column' }}>
                                <Text style={styles.text}>Meetings</Text>


                                {

                                    (!this.state.meeting_loading)
                                        ?
                                        (
                                            <View>
                                                {

                                                    (MeetingArray[0] === 0 &&
                                                        MeetingArray[1] === 0 &&
                                                        MeetingArray[2] === 0)
                                                        ?
                                                        (


                                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                                                                <Text style={{ fontSize: 12, color: 'grey' }}>No Meetings</Text>
                                                            </View>
                                                        )
                                                        :
                                                        (
                                                            <PieChart
                                                                style={styles.pie}
                                                                chart_wh={activity_chart_wh}
                                                                series={MeetingArray}
                                                                doughnut={true}
                                                                sliceColor={sliceColor}
                                                            />

                                                        )
                                                }

                                                {
                                                    MeetingArray[0] !== 0 &&
                                                    <View style={{ flexDirection: 'row', marginTop: 20 }} >
                                                        <View style={{ width: 8, height: 8, backgroundColor: '#ff9600' }} />
                                                        <Text style={{ fontSize: 8, marginLeft: 5 }}>Planned({MeetingArray[0]})</Text>
                                                    </View>
                                                }


                                                {
                                                    MeetingArray[1] !== 0 &&

                                                    <View style={{ flexDirection: 'row', marginTop: 5 }} >
                                                        <View style={{ width: 8, height: 8, backgroundColor: '#009e00' }} />
                                                        <Text style={{ fontSize: 8, marginLeft: 5 }}>Held({MeetingArray[1]})</Text>
                                                    </View>


                                                }



                                                {
                                                    MeetingArray[2] !== 0 &&
                                                    <View style={{ flexDirection: 'row', marginTop: 5 }} >
                                                        <View style={{ width: 8, height: 8, backgroundColor: '#a8009d' }} />
                                                        <Text style={{ fontSize: 8, marginLeft: 5 }}>Not Held({MeetingArray[2]})</Text>
                                                    </View>

                                                }




                                            </View>

                                        ) :
                                        (

                                            <View style={{ flexDirection: 'column', justifyContent: 'center', flex: 1, height: null }}>
                                                <ActivityIndicator color="red" size="small" />
                                            </View>


                                        )



                                }



                            </View>

                            <View style={{ flex: 1, alignItems: 'center', flexDirection: 'column' }}>
                                <Text style={styles.text}>Tasks</Text>

                                {

                                    (!this.state.task_loading)
                                        ?
                                        (
                                            <View>

                                                {

                                                    (TaskArray[0] === 0 &&
                                                        TaskArray[1] === 0 &&
                                                        TaskArray[2] === 0 &&
                                                        TaskArray[3] === 0 &&
                                                        TaskArray[4] === 0)
                                                        ?
                                                        (
                                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                                                                <Text style={{ fontSize: 12, color: 'grey' }}>No Tasks</Text>
                                                            </View>

                                                        )
                                                        :
                                                        (
                                                            <PieChart
                                                                style={styles.pie}
                                                                // chart_wh={70}
                                                                chart_wh={activity_chart_wh}
                                                                series={TaskArray}
                                                                doughnut={true}
                                                                sliceColor={tasksColor}
                                                            />
                                                        )
                                                }



                                                {
                                                    TaskArray[0] !== 0 &&

                                                    <View style={{ flexDirection: 'row', marginTop: 20 }} >
                                                        <View style={{ width: 8, height: 8, backgroundColor: '#ff9600' }} />
                                                        <Text style={{ fontSize: 8, marginLeft: 5 }}>Not Started({TaskArray[0]})</Text>
                                                    </View>

                                                }




                                                {
                                                    TaskArray[1] !== 0 &&
                                                    <View style={{ flexDirection: 'row', marginTop: 5 }} >
                                                        <View style={{ width: 8, height: 8, backgroundColor: '#009e00' }} />
                                                        <Text style={{ fontSize: 8, marginLeft: 5 }}>In Progress({TaskArray[1]})</Text>
                                                    </View>

                                                }



                                                {

                                                    TaskArray[2] !== 0 &&
                                                    <View style={{ flexDirection: 'row', marginTop: 5 }} >
                                                        <View style={{ width: 8, height: 8, backgroundColor: '#a8009d' }} />
                                                        <Text style={{ fontSize: 8, marginLeft: 5 }}>Completed({TaskArray[2]})</Text>
                                                    </View>


                                                }


                                                {
                                                    TaskArray[3] !== 0 &&
                                                    <View style={{ flexDirection: 'row', marginTop: 5 }} >
                                                        <View style={{ width: 8, height: 8, backgroundColor: '#4328b2' }} />
                                                        <Text style={{ fontSize: 8, marginLeft: 5 }}>Pending Input({TaskArray[3]})</Text>
                                                    </View>

                                                }



                                                {
                                                    TaskArray[4] !== 0 &&
                                                    <View style={{ flexDirection: 'row', marginTop: 5 }} >
                                                        <View style={{ width: 8, height: 8, backgroundColor: '#0099cc' }} />
                                                        <Text style={{ fontSize: 8, marginLeft: 5 }}>Deffered({TaskArray[4]})</Text>
                                                    </View>
                                                }




                                            </View>

                                        ) :
                                        (

                                            <View style={{ flexDirection: 'column', justifyContent: 'center', flex: 1, height: null }}>
                                                <ActivityIndicator color="red" size="small" />
                                            </View>


                                        )



                                }


                            </View>
                        </View>

                    </Card>

                    <Card>
                        <View style={{ marginLeft: 10 }} >
                            <Text style={styles.text}>Leads</Text>
                        </View>

                        {

                            (!this.state.lead_loading)
                                ?
                                (

                                    <View>
                                        {

                                            (LeadsArray[0] === 0 &&
                                                LeadsArray[1] === 0 &&
                                                LeadsArray[2] === 0 &&
                                                LeadsArray[3] === 0 &&
                                                LeadsArray[4] === 0 &&
                                                LeadsArray[5] === 0 &&
                                                LeadsArray[6] === 0 &&
                                                LeadsArray[7] === 0 &&
                                                LeadsArray[8] === 0 &&
                                                LeadsArray[9] === 0)
                                                ?
                                                (
                                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                                                        <Text style={{ fontSize: 12, color: 'grey' }}>No Leads</Text>
                                                    </View>
                                                )
                                                :
                                                (
                                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: "center", padding: 0, marginLeft: 0 }}>

                                                        <PieChart
                                                            chart_wh={opportunity_chart_wh}
                                                            series={LeadsArray}
                                                            doughnut={true}
                                                            sliceColor={leadsColor}
                                                        />
                                                    </View>

                                                )
                                        }


                                        <View style={{ flex: 1, marginLeft: 0, marginTop: 10, padding: 5, flexDirection: 'row' }} >

                                            {
                                                LeadsArray[0] !== 0 &&
                                                <View style={{ flexDirection: 'row', marginLeft: 5 }} >
                                                    {/* <View style={{ width: 8, height: 8, backgroundColor: '#ed1900' }} /> */}
                                                    <View style={{ width: 8, height: 8, backgroundColor: leadsColor[0] }} />
                                                    <Text style={{ fontSize: 8, marginLeft: 5 }}>Open({LeadsArray[0]})</Text>
                                                </View>
                                            }

                                            {/* assigned */}


                                            {
                                                LeadsArray[1] !== 0 &&
                                                <View style={{ flexDirection: 'row', marginLeft: 5 }} >
                                                    {/* <View style={{ width: 8, height: 8, backgroundColor: '#ff9700' }} /> */}
                                                    <View style={{ width: 8, height: 8, backgroundColor: leadsColor[1] }} />
                                                    <Text style={{ fontSize: 8, marginLeft: 5 }}>Duplicate Lead({LeadsArray[1]})</Text>
                                                </View>
                                            }

                                            {/* in process */}

                                            {
                                                LeadsArray[2] !== 0 &&
                                                <View style={{ flexDirection: 'row', marginLeft: 5 }} >
                                                    {/* <View style={{ width: 8, height: 8, backgroundColor: '#009e00' }} /> */}
                                                    <View style={{ width: 8, height: 8, backgroundColor: leadsColor[2] }} />
                                                    <Text style={{ fontSize: 8, marginLeft: 5 }}>Existing Client({LeadsArray[2]})</Text>
                                                </View>
                                            }



                                        </View>

                                        <View style={{ flex: 1, marginLeft: 0, marginTop: 0, padding: 5, flexDirection: 'row' }} >

                                            {
                                                LeadsArray[3] !== 0 &&
                                                <View style={{ flexDirection: 'row', marginLeft: 5 }} >
                                                    {/* <View style={{ width: 8, height: 8, backgroundColor: '#a8009d' }} /> */}
                                                    <View style={{ width: 8, height: 8, backgroundColor: leadsColor[3] }} />
                                                    <Text style={{ fontSize: 8, marginLeft: 5 }}>CSO Allocated({LeadsArray[3]})</Text>
                                                </View>
                                            }

                                            {
                                                LeadsArray[4] !== 0 &&
                                                <View style={{ flexDirection: 'row', marginLeft: 5 }} >
                                                    {/* <View style={{ width: 8, height: 8, backgroundColor: '#4328b2' }} /> */}
                                                    <View style={{ width: 8, height: 8, backgroundColor: leadsColor[4] }} />
                                                    <Text style={{ fontSize: 8, marginLeft: 5 }}>RM Allocated({LeadsArray[4]})</Text>
                                                </View>
                                            }
                                            {
                                                LeadsArray[5] !== 0 &&
                                                <View style={{ flex: 1, marginLeft: 10, padding: 5, marginBottom: 10 }} >
                                                    <View style={{ flexDirection: 'row', marginLeft: 5 }} >
                                                        {/* <View style={{ width: 8, height: 8, backgroundColor: '#0098cb' }} /> */}
                                                        <View style={{ width: 8, height: 8, backgroundColor: leadsColor[5] }} />
                                                        <Text style={{ fontSize: 8, marginLeft: 5 }}>Converted({LeadsArray[5]})</Text>
                                                    </View>

                                                </View>
                                            }
                                        </View>

                                        <View style={{ flex: 1, marginLeft: 0, marginTop: 0, padding: 5, flexDirection: 'row' }} >

                                            {
                                                LeadsArray[6] !== 0 &&
                                                <View style={{ flexDirection: 'row', marginLeft: 5 }} >
                                                    {/* <View style={{ width: 8, height: 8, backgroundColor: '#a8009d' }} /> */}
                                                    <View style={{ width: 8, height: 8, backgroundColor: leadsColor[6] }} />
                                                    <Text style={{ fontSize: 8, marginLeft: 5 }}>Lost({LeadsArray[6]})</Text>
                                                </View>
                                            }

                                            {
                                                LeadsArray[7] !== 0 &&
                                                <View style={{ flexDirection: 'row', marginLeft: 5 }} >
                                                    {/* <View style={{ width: 8, height: 8, backgroundColor: '#4328b2' }} /> */}
                                                    <View style={{ width: 8, height: 8, backgroundColor: leadsColor[7] }} />
                                                    <Text style={{ fontSize: 8, marginLeft: 5 }}>Appointment({LeadsArray[7]})</Text>
                                                </View>
                                            }

                                            {
                                                LeadsArray[8] !== 0 &&
                                                <View style={{ flex: 1, marginLeft: 10, padding: 5, marginBottom: 10 }} >
                                                    <View style={{ flexDirection: 'row', marginLeft: 5 }} >
                                                        {/* <View style={{ width: 8, height: 8, backgroundColor: '#0098cb' }} /> */}
                                                        <View style={{ width: 8, height: 8, backgroundColor: leadsColor[8] }} />
                                                        <Text style={{ fontSize: 8, marginLeft: 5 }}>Follow Up({LeadsArray[8]})</Text>
                                                    </View>

                                                </View>
                                            }
                                        </View>
                                        <View style={{ flex: 1, marginLeft: 0, marginTop: 0, padding: 5, flexDirection: 'row' }} >


                                            {
                                                LeadsArray[9] !== 0 &&
                                                <View style={{ flexDirection: 'row', marginLeft: 5 }} >
                                                    {/* <View style={{ width: 8, height: 8, backgroundColor: '#a8009d' }} /> */}
                                                    <View style={{ width: 8, height: 8, backgroundColor: leadsColor[9] }} />
                                                    <Text style={{ fontSize: 8, marginLeft: 5 }}>Cross Sell({LeadsArray[9]})</Text>
                                                </View>
                                            }
                                        </View>
                                    </View>
                                ) :
                                (
                                    <View style={{ marginBottom: 20, flexDirection: 'column', justifyContent: 'center', flex: 1, height: null }}>
                                        <ActivityIndicator color="red" size="small" />
                                    </View>
                                )
                        }

                    </Card>

                </View>

            </ScrollView>

        );
    }


}

const mapStateToProps = (state, ownProps) => {
    return {
         isLoggedIn: state.auth.isLoggedIn,
        loginTime: state.auth.loginTime,
        token: state.auth.token,
        username: state.auth.username,
        password: state.auth.password,
        assigned_user_id: state.auth.assigned_user_id,
        url: state.auth.url,

    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ logout, updateToken }, dispatch)
};

export default Login = connect(mapStateToProps, mapDispatchToProps)(MTD);