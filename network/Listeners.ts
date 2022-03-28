export default interface Listeners{
    onError(errorMessage);
    onSuccess(response)
    onAuthFailed(errorMessage)
}