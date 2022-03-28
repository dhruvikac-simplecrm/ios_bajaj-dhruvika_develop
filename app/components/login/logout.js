// import { Alert} from 'react-native';
// import { connect } from 'react-redux';
// import { logout } from '../../actions/auth';
// import { bindActionCreators } from 'redux';

// const handleSessionExpire = (props)=>{
//     return Alert.alert(
//         globals.app_messages.error_string,
//         globals.app_messages.token_expired,
//         [
//         { text: 'Login', onPress: () => props.logout() }
//                    ],
//         { cancelable: false }
//     )
// }

// const mapStateToProps = (state, ownProps) => {
//     return {
//          isLoggedIn: state.auth.isLoggedIn,
        // loginTime: state.auth.loginTime,
//         username: state.auth.username,
//         token: state.auth.token,
//         url: state.auth.url,
//     };
// }

// const mapDispatchToProps = (dispatch) => {
//     return bindActionCreators({ logout }, dispatch)
// };

// export default Logout = connect(mapStateToProps, mapDispatchToProps)(Leads);

