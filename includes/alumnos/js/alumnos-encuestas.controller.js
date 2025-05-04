(function() {
    'use strict';

    angular.module('Controllers')
        .controller('alumnosEncuestasController', alumnosEncuestasController);

    alumnosEncuestasController.$injet = ['LxDialogService',  '$http', '$httpParamSerializerJQLike', 
                        'SessionService', '$filter', '$scope', 'LxNotificationService'];

    function alumnosEncuestasController(LxDialogService, $http, $httpParamSerializerJQLike, 
                                SessionService, $filter, $scope, LxNotificationService) {
        var vm = this;
        vm.showLinearProgress = false;
        vm.enviado = false;
        vm.formaActiva = true;
        vm.hayDatos = false;
        vm.editarExp = false;
        vm.activeTab = 0;
        vm.alumnoValidado = SessionService.sessionAlumno();
        vm.alumnoConEncuesta = false;
        vm.cancelarDatos = cancelarDatos;
        vm.cancelMouseover = cancelMouseover;
        vm.scrollDown = scrollDown;
        vm.responderEncuesta = responderEncuesta;
        vm.guardarEncuesta = guardarEncuesta;
        vm.cancelarEdicion = cerrarEncuesta;
        vm.cambiaOpcion = cambiaOpcion;

        //console.log(vm.alumnoValidado);
        vm.f = new Date();
        vm.campos = {
            alumno: SessionService.sessionCuentaAlumno(),
            num: null,
            materia: null,
            ciclo: null,
            fecha: vm.f.getDate() + "/" + vm.f.getMonth() + "/" + vm.f.getFullYear(),
            aplicada: null
        };

        vm.reactivos = [];
        vm.encuesta = [];
        vm.respuestas = [];

        vm.dataTableThead = [
            {   name: 'id',     label: 'NO.',   sortable: true, width: '8%' },
            {   name: 'materia',  label: 'MATERIA', sortable: true, sort: 'des', width: '48%'  },
            {   name: 'ciclo',  label: 'CICLO', sortable: true, width: '19%' },
            {   name: 'fecha',  label: 'FECHA', sortable: true, width: '17%' },
            {   name: 'aplicada',   label: 'APLICADA',    sortable: true, width: '8%' }
        ];

        vm.dataTableTbody = [];
        
        $scope.$on('lx-data-table__selected', updateActions);
        $scope.$on('lx-data-table__unselected', updateActions);
        $scope.$on('lx-data-table__sorted', updateSort);

        // verSiTieneEncuesta();

        ////////////

        if (vm.alumnoValidado) { // si inicio sesión normal
            leerEncuestas();             // DESACTIVA/DESACTIVA LAS ENCUESTAS
        }

        function updateActions(_event, _dataTableId, _selectedRows) {
            if (_dataTableId === 'encuestas') {
                vm.selectedCons = _selectedRows;
            }
            if (_selectedRows.length >=2 ) {
                LxNotificationService.warning("Debe seleccionar una solo encuesta...", false);
            }
        }

        function updateSort(_event, _dataTableId, _column) {
            vm.dataTableTbody = $filter('orderBy')(vm.dataTableTbody, _column.name, _column.sort === 'desc' ? true : false);
        }
        
        function leerEncuestas() {        // recupera los periodos y los muestra en forma de tabla
            // validar los datos antes de ser enviados...

            var datosEnviar = { 
                                "registrar"  : "LeerEncuestas"
            };
            
            vm.showLinearProgress = true;       // progress...
            vm.enviado = true;

            $http({
                method: 'POST',
                timeout: 15000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/leer_encuestas_alumno.php'
            })
            .then( function ok(resp) {
                vm.showLinearProgress = false;
                vm.enviado = false;
                var r = resp.data;
                //vm.formaActiva = true;
                if (r.status == 'Ok') {
                    //$('div#msgInfo').html(r.data);
                    vm.dataTableTbody = r.encuesta;
                    // console.log("encuesta =" + r.encuesta.length);
                    if (r.encuesta.length == 0) { // no tiene encuestas...
                        vm.alumnoConEncuesta = false;
                    } else {
                        vm.alumnoConEncuesta = true;
                    }
                } else {
                    $('div#msgError').html('<b>Error:</b><br>' + r.error);
                    //vm.htmlmsg = resp.data;
                    LxDialogService.open('dlgError');
                    //cbExpiration();
                    }
                
                }, function error(resp) {
                    vm.showLinearProgress = false;
                    vm.enviado = false;
                    var r = resp.data;
                    //console.log(resp);
                    $('div#msgError').html('<b>Error:</b><br>' + r.data);
                    //vm.htmlmsg = resp.data;
                    LxDialogService.open('dlgError');
                    //cbExpiration();
            });

        }

        function responderEncuesta() {        // lee el expediente seleccionado...
            // validar los datos antes de ser enviados...
            vm.editarExp = true;
            vm.activeTab = 1;
            // Mostrar las preguntas... // vm.selectedCons[0].encuesta == encuesta seleccionada.. 
            // console.log( "Encuesta: " + vm.selectedCons[0].encuesta);
            leerReactivos(vm.selectedCons[0].encuesta);
        }

        function cerrarEncuesta() {        // lee el expediente seleccionado...
            // validar los datos antes de ser enviados...
            vm.editarExp = false;
            vm.activeTab = 0;
            // Guardar las respuestas...
        }
        // controla la entrada al expediente.
        function leerReactivos(encuesta) {
            if (vm.alumnoValidado) {
                // llenar el select con los ciclo activos..
                var datosEnviar = { "Leer"     : "LeerReactivos",
                                    "encuesta" : encuesta
                                   };
                $http({
                    method: 'POST',
                    timeout: 15000,
                    data: $httpParamSerializerJQLike(datosEnviar),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                    url: '/siiFCA/api/leer_reactivos.php'
                })
                .then( function ok(resp) {
                    var r = resp.data;
                    if (resp.status === 200 && r.status === 'Ok') {
                        vm.reactivos = r.reactivos;
                        vm.encuesta = r.encuesta;
                        vm.respuestas = r.respuestas;
                        // console.log(vm.reactivos[1].tema); // ya es un JSON
                    } else {    console.log(resp);
                        $('div#msgError').html('<b>Error:</b><br>' + r.error);
                        //vm.htmlmsg = resp.data;
                        LxDialogService.open('dlgError');
                    }
                    
                }, function error(resp) {
                    $('div#msgError').html('<b>Error:</b><br>' + resp.data);
                    //vm.htmlmsg = resp.data;
                    LxDialogService.open('dlgError');
                });
                
            }
        }

        function guardarEncuesta() { 
            // validar los datos antes de ser enviados...
            var noError = true;
            var errorText = "Error: <br>";

            if (vm.encuesta[0].maestro === undefined || vm.encuesta[0].maestro === null) {
                noError = false;
                errorText = errorText + "Debe indicar el nombre del Docente<br>";
            }            

            if (noError) {
                var datosEnviar = { "encuesta"  : vm.encuesta[0].idenc,
                                    "maestro"   : vm.encuesta[0].maestro,
                                "observaciones" : vm.encuesta[0].observaciones,
                                  "respuestas"  : vm.respuestas,
                                   "registrar"  : "GuardarEncuesta"
                };

                vm.showLinearProgress = true;       // progress...
                vm.enviado = true;

                $http({
                    method: 'POST',
                    timeout: 15000,
                    data: datosEnviar,
                    headers: { 'Content-Type': 'application/json;charset=UTF-8','Data-Type': 'json' },
                    url: '/siiFCA/api/guardar_encuesta_alumno.php'
                })
                .then( function ok(resp) {
                    vm.showLinearProgress = false;
                    vm.enviado = false;
                    var r = resp.data;
                    //vm.formaActiva = true;
                    // console.log(r.encuesta);
                    if (resp.status === 200 && r.status === 'Ok') {
                        vm.showLinearProgress = false;
                        vm.enviado = false;
                        // console.log(r.respuesta);  // probar el arreglo...
                        $('div#msgInfo').html(r.data);
                        LxDialogService.open('dlgInfo');
                        vm.cancelarDatos();
                        vm.activeTab = 0;
                        vm.selectedCons[0].aplicada = "SI";
                        // console.log(vm.selectedCons);
                        leerEncuestas();

                    } else {
                        $('div#msgError').html('<b>Error:</b><br>' + r.error);
                        //vm.htmlmsg = resp.data;
                        LxDialogService.open('dlgError');
                    }
                    
                }, function error(resp) {
                    vm.showLinearProgress = false;
                    vm.enviado = false;
                    //console.log(resp);
                    $('div#msgError').html('<b>Error:</b><br>' + resp.data);
                    //vm.htmlmsg = resp.data;
                    LxDialogService.open('dlgError');
                });

            } else {
                $('div#msgError').html(errorText);
                //vm.msg = errorText;
                LxDialogService.open('dlgError');
            }
        
        }

        function cambiaOpcion(_indice) { 
            var i;
            var todos = vm.respuestas.length;
            for ( i = _indice + 1; i < todos; i++ ) {
                if ( i == todos ||  vm.reactivos[i].tipo == 0) {
                    break;
                } else {
                    vm.respuestas[i].cumplio = !vm.respuestas[i].cumplio;
                }
            }

      
        }
       
        function cancelarDatos() {
            vm.showLinearProgress = false;		// progress...
            vm.enviado = false;
            //vm.formaActiva = true;
            vm.reactivos = [];
            // vm.encuesta = [];;
    
        }

        function scrollDown() {
             $("body").trigger($.Event("keyup", { keyCode: 40 }));
        }

        function cancelMouseover(_event){
            _event.preventDefault();
            _event.stopImmediatePropagation();
        }


    }

})();
jQuery.event.special.touchstart = {
    setup: function( _, ns, handle ){
      if ( ns.includes("noPreventDefault") ) {
        this.addEventListener("touchstart", handle, { passive: false });
      } else {
        this.addEventListener("touchstart", handle, { passive: true });
      }
    }
};
