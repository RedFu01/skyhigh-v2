/* This service is designed to handle all the communication from the object View to BE*/
app.factory('dataService', ['backendService', function (backendService) {
    //var baseUrl = "http://192.168.22.10/v1";
    var baseUrl = "http://85.214.221.164:8000/";
    var urls = {
       getDrugsUrl: baseUrl + 'drugs/',
        getActivitiesUrl: function (userId) {
            return baseUrl + 'users/'+userId+'/activities/'
        },
       getUsersUrl: baseUrl + 'users/',
        getIllnessesUrl: function (userId) {
            return baseUrl + 'users/'+userId+'/illnesses/'
        },
        addIllnessesUrl: function (drugid,userId) {
            return baseUrl + 'illnesses/add/'+ drugid+'/'+userId+'/'
        }
    }

    var getDrugs = function(){
        return backendService.ajaxGetRequest(urls.getDrugsUrl)
    }
    var getMedicalHistory = function(userId){
        return backendService.ajaxGetRequest(urls.getIllnessesUrl(userId))
    }
    var getUsers = function(){
        return backendService.ajaxGetRequest(urls.getUsersUrl)
    }
    var getActivities = function(userId) {
        return backendService.ajaxGetRequest(urls.getActivitiesUrl(userId))
    }
    var addIllness = function(drugId,userId){
                return backendService.ajaxGetRequest(urls.addIllnessesUrl(drugId,userId))

    }

    return {
        getDrugs:getDrugs,
        getUsers:getUsers,
        getMedicalHistory:getMedicalHistory,
        getActivities:getActivities,
        addIllness:addIllness
    };
}])
