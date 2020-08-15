var umlRenderer = (function () {
    "use strict"
    return {
        renderContent: function(rawContent, options) {

            try 
            {                 
                VSS.require(["TFS/ServiceEndpoint/ServiceEndpointRestClient"], function(serviceEndpointService){
                    serviceEndpointService.getClient().getServiceEndpoints(VSS.getWebContext().project.name, 'plantuml')
                        .then((result) => {
                            
                            return result[0].url
                        })
                        .catch((err) => {
                            console.warn(`fail get PlantUML server with service connection: ${err}`)
                            return 'https://www.plantuml.com/plantuml'
                        })
                        .then((plant_uml_server) => {
                            let diagramUrl = plant_uml_server+compress(rawContent)
                            fetch(diagramUrl)
                            .then((res3) => {
                                return res3.text()
                            })
                            .then((res2) => {
                                document.getElementById("spinner").style.display = "none"
                                document.getElementById("container").innerHTML = res2
                            })
                            .catch((err) => {
                                document.getElementById("container").innerHTML = `<h2 style=" color: red;">Не удалось загурзить диаграмму:</h2> ${diagramUrl}`
                                console.error(err)
                                document.getElementById("spinner").style.display = "none"
                            }) 
                            console.log('resultURL: ' + diagramUrl)
                        })
                }) 
             }
            catch (err)
            {
                console.log(err)
                errMsg = "Fail render"
                document.getElementById("spinner").style.display = "none"
            }
        }
    }
}())

VSS.init({
    usePlatformScripts: true, 
    usePlatformStyles: true, 
    explicitNotifyLoaded: true 
});

VSS.ready(function () {
    VSS.register("plant_uml_renderer", function (context) {
        return umlRenderer;
    });

	VSS.notifyLoadSucceeded();
});