(function() {
    'use strict';

    angular.module('Controllers')
        .controller('alumnosExpedienteController', alumnosExpedienteController);

    alumnosExpedienteController.$injet = ['LxDialogService', 'LxDataTableService', '$http', '$httpParamSerializerJQLike', 
                        'SessionService', '$filter', '$scope' ];

    function alumnosExpedienteController(LxDialogService, LxDataTableService, $http, $httpParamSerializerJQLike, 
                                SessionService, $filter, $scope ) {
        var vm = this;
        vm.showLinearProgress = false;
        vm.enviado = false;
        vm.formaActiva = true;
        vm.hayDatos = false;
        vm.editarExp = false;
        vm.activeTab = 0;
        vm.idacad = null;
        vm.alumnoValidado = SessionService.sessionAlumno();
        vm.datosResumen = datosResumen;
        vm.cancelarDatos = cancelarDatos;
        vm.enviarDatos = enviarDatos;
        vm.cancelMouseover = cancelMouseover;
        vm.scrollDown = scrollDown;
        vm.callbackCiclo = callbackCiclo;
        vm.callbackUo = callbackUo;
        vm.callbackTurno = callbackTurno;
        vm.callbackCarrera = callbackCarrera;
        vm.selectModalidad = selectModalidad;
        vm.editarExpediente = editarExpediente;
        vm.guardarExpediente = guardarExpediente;
        vm.cancelarEdicion = cancelarEdicion;

        //console.log(vm.alumnoValidado);
        vm.selectCiclo = {};
        vm.selectUo = {};
        vm.selectCarrera  = [ 
            { "name" : "TC" },
            { "name" : "LCP" },
            { "name" : "LAE" },
            { "name" : "LNCI" },
            { "name" : "LM" }       // LGT
        ];
        vm.selectTurno  = [ 
            { "name" : "MATUTINO" },
            { "name" : "VESPERTINO" },
            { "name" : "NOCTURNO" },
            { "name" : "SABATINO" },
            { "name" : "VIRTUAL" },
        ];
        vm.selectGrado  = [ 
            { "name" : "PRIMERO", "id": 1 }, 
            { "name" : "SEGUNDO", "id": 2 }, 
            { "name" : "TERCERO", "id": 3 }, 
            { "name" : "CUARTO", "id": 4 }, 
            { "name" : "QUINTO", "id": 5 }
        ];

        vm.campos = {
            alumno: SessionService.sessionCuentaAlumno(),
            ciclo: null,
            uo: null,
            modalidad: 0,
            carrera: vm.selectCarrera[0],
            turno: vm.selectTurno[0],
            grado: vm.selectGrado[0],
            grupo: null,
            aula: "",
            huella: false
        };
        vm.turnoAnterior = vm.campos.turno;

        vm.dataTableThead = [
            {   name: 'id',     label: 'NO.',   sortable: true, width: '10%' },
            {   name: 'ciclo',  label: 'CICLO', sortable: true, sort: 'des', width: '30%'  },
            {   name: 'grado',  label: 'GRADO', sortable: true, width: '10%' },
            {   name: 'grupo',  label: 'GRUPO', sortable: true, width: '10%' },
            {   name: 'uo',     label: 'UO',    sortable: true, width: '10%' },
            {   name: 'carrera', label: 'CARRERA', sortable: true, width: '10%' },
            {   name: 'turno',  label: 'TURNO', sortable: true, width: '20%' },
        ];

        vm.dataTableTbody = [];
        
        $scope.$on('lx-data-table__selected', updateActions);
        $scope.$on('lx-data-table__unselected', updateActions);
        $scope.$on('lx-data-table__sorted', updateSort);

        entradaExpediente();

        ////////////

        if (vm.alumnoValidado) { // si inicio sesión normal
            leerExpedienteAcademico();
        }

        function updateActions(_event, _dataTableId, _selectedRows) {
            if (_dataTableId === 'expediente') {
                if (_event.name === 'lx-data-table__selected' && _selectedRows.length >1) {
                    // vm.selectedExp.length = 0;
                    LxDataTableService.unselect(_dataTableId, _selectedRows[0]);
                 }

                // vm.selectedExp.length = 0;
                vm.selectedExp = _selectedRows;
                vm.idacad = (_selectedRows.length === 0 ? 0 : _selectedRows[0].id);
            }
        }

        function updateSort(_event, _dataTableId, _column) {
            vm.dataTableTbody = $filter('orderBy')(vm.dataTableTbody, _column.name, _column.sort === 'desc' ? true : false);
        }
        
        function leerExpedienteAcademico() {        // recupera los periodos y los muestra en forma de tabla
            // validar los datos antes de ser enviados...

            var datosEnviar = { 
                                "registrar"  : "LeerExpedienteAcademico"
            };
            
            vm.showLinearProgress = true;       // progress...
            vm.enviado = true;

            $http({
                method: 'POST',
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/leer_expediente_alumno.php'
            })
            .then( function ok(resp) {
                vm.showLinearProgress = false;
                vm.enviado = false;
                var r = resp.data;
                //vm.formaActiva = true;
                if (r.status == 'Ok') {
                    //$('div#msgInfo').html(r.data);
                    vm.selectedExp = [];
                    vm.idacad = 0;
                    vm.dataTableTbody = r.expediente;

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

        function editarExpediente() {        // lee el expediente seleccionado...
            // validar los datos antes de ser enviados...
            vm.editarExp = true;
            vm.activeTab = 2;
    
            vm.idacad = vm.selectedExp[0].id;
            leerExpedienteID();                 // para ponerlo en pantalla de modificación...

        }

        function cancelarEdicion() {        // cierra el TAB MODIFICAR...
            // validar los datos antes de ser enviados...
            vm.editarExp = false;
            vm.activeTab = 0;
            vm.selectedExp = [];
            LxDataTableService.unselectAll( 'expediente' );
            vm.idacad = vm.idacad = (vm.selectedExp.length === 0 ? 0 : vm.selectedExp[0].id);
        }

        // controla la entrada al expediente.
        function entradaExpediente() {
            if (vm.alumnoValidado) {
                // llenar el select con los ciclo activos..
                var datosEnviar = { "llenar"  : "LlenarCiclo" };
                $http({
                    method: 'POST',
                    timeout: 50000,
                    data: $httpParamSerializerJQLike(datosEnviar),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                    url: '/siiFCA/api/llenado_campos.php'
                })
                .then( function ok(resp) {
                    var r = resp.data;
                    if (resp.status === 200 && r.status === 'Ok') {
                        vm.selectCiclo = r.ciclos;
                        vm.selectUo = r.uos;
                    } else {    // 
                        // console.log(resp);
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

        // Leer un expediente por idacad vm..
        function leerExpedienteID() {
            // llenar el select con los ciclo activos..
            var datosEnviar = { "idacad" : vm.idacad, "llenar"  : "LlenarExpedienteID" };
            $http({
                method: 'POST',
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/llenado_expedientexID.php'
            })
            .then( function ok(resp) {
                var r = resp.data;
                // console.log(resp.data);
                if (resp.status === 200 && r.status === 'Ok') {
                    vm.campos = r.campos[0];
                    vm.idacad = parseInt(r.campos.idacad);
                    // console.info(r);

                } else {    // 

                    $('div#msgError').html('<b>Error:</b><br>' + r.error);
                    //vm.htmlmsg = resp.data;
                    LxDialogService.open('dlgError');
                }

            }, function error(resp) {
                $('div#msgError').html('<b>Error:</b><br>' + resp.data);
                //vm.htmlmsg = resp.data;
        
            });

        } // salida de leerExpdieteIC

        // Guarda Expediente...
        function guardarExpediente() {
            // para guardar modificaciones...
            enviarDatos();

        }
            
        function enviarDatos( ) { 
            // validar los datos antes de ser enviados...
            var noError = true;
            var errorText = "Error: <br>";

            if (vm.campos.ciclo === null || vm.campos.ciclo.id === undefined) {
                noError = false;
                errorText = errorText + "Debe indicar el Ciclo Escolar actual<br>";
            }            
            if (vm.campos.uo === null || vm.campos.uo.uo === undefined) {
                noError = false;
                errorText = errorText + "Debe indicar el Campus / UO<br>";
            }            
            if (vm.campos.carrera === null || vm.campos.carrera.name === undefined) {
                noError = false;
                errorText = errorText + "Debe indicar la Carrera<br>";
            }            
            if (vm.campos.turno === null || vm.campos.turno.name === undefined) {
                noError = false;
                errorText = errorText + "Debe indicar el Turno<br>";
            }            
            if (vm.campos.grado === null || vm.campos.grado.id === undefined) {
                noError = false;
                errorText = errorText + "Debe indicar el Año/Grado actual<br>";
            }            
            if (vm.campos.grupo === null || vm.campos.grupo === 0) {
                noError = false;
                errorText = errorText + "Debe indicar el grupo<br>";
            }            
                
            if (noError) {
                var datosEnviar = { "nuevo"     : (vm.idacad !== null) ? vm.idacad : 0,
                                    "alumno"    : vm.campos.alumno,
                                    "ciclo"     : vm.campos.ciclo.id,
                                    "uo"        : vm.campos.uo.uo,
                                    "modalidad" : vm.campos.modalidad,
                                    "carrera"   : vm.campos.carrera.name,
                                    "turno"     : vm.campos.turno.name,
                                    "grado"     : vm.campos.grado.id,
                                    "grupo"     : vm.campos.grupo,
                                    "aula"      : (vm.campos.aula !== undefined) ? vm.campos.aula : "0",
                                    "huella"    : (vm.campos.huella == false) ? 0 : 1,
                                   "registrar"  : "registroExpedAcad"
                };

                vm.showLinearProgress = true;       // progress...
                vm.enviado = true;

                $http({
                    method: 'POST',
                    timeout: 90000,
                    data: $httpParamSerializerJQLike(datosEnviar),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                    url: '/siiFCA/api/registro_expedacad_alumno.php'
                })
                .then( function ok(resp) {
                    vm.showLinearProgress = false;
                    vm.enviado = false;
                    var r = resp.data;
                    //vm.formaActiva = true;
                    if (resp.status === 200 && r.status === 'Ok') {
                        vm.showLinearProgress = false;
                        vm.enviado = false;
                        $('div#msgInfo').html(r.data);
                        LxDialogService.open('dlgInfo');
                        vm.cancelarDatos();
                        vm.editarExp = false;
                        vm.activeTab = 0;
                        leerExpedienteAcademico();
                        vm.selectedExp = [];

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

        function datosResumen() { 

            var datosEnviar = {  
                                "registrar"  : "registroExpediente"
                              };

            vm.showLinearProgress = true;       // progress...
            vm.enviado = true;

            $http({
                method: 'POST',
                timeout: 15000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/registro_expedacad_alumno.php'
            })
            .then( function ok(resp) {
                vm.showLinearProgress = false;
                vm.enviado = false;
                var r = resp.data;
                //vm.formaActiva = true;
                if (resp.status === 200 && r.status === 'Ok') {
                    $('div#msgInfo').html('Se han guardado los datos académicos..!!');
                    LxDialogService.open('dlgInfo');
                    vm.res = r.resumen;
                    vm.hayDatos = true;
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
        
        }
       
        function callbackCiclo(_new, _old){

        }

        function callbackUo(_new, _old){
            if (_new.uo == 2301 || _new.uo == 2302) {
                vm.campos.turno = vm.selectTurno[3];

			} else if (_new.uo == 2309 ) { // virtual
                vm.campos.turno = vm.selectTurno[4];

            } else {
                vm.campos.turno = vm.selectTurno[0];

            }
        }

        function callbackTurno(_new, _old){
            // FALTA DESARROLLAR ...

        }

        function callbackCarrera(_new, _old){
            if (_new.name == "TC") {
                vm.campos.grado = vm.selectGrado[0];

            } else {
                vm.campos.grado = vm.selectGrado[1];

            }
        }

        function selectModalidad(){
            if (vm.campos.modalidad) {    // es semiescolarizada...
                vm.campos.turno = vm.selectTurno[3];
            } else {
                vm.campos.turno = vm.turnoAnterior;

            }
        }

        function cancelarDatos() {
            vm.showLinearProgress = false;		// progress...
            vm.enviado = false;
            //vm.formaActiva = true;
            vm.campos = {
                alumno: SessionService.sessionCuentaAlumno(),
                ciclo: null,
                uo: null,
                modalidad: 0,
                carrera: vm.selectCarrera[0],
                turno: vm.selectTurno[0],
                grado: vm.selectGrado[0],
                grupo: null,
                aula: "",
                huella: false
            };
        
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
