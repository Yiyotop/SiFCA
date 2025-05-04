(function() {
    'use strict';

    angular.module('Controllers')
        .controller('alumnosCreditosController', alumnosCreditosController);

    alumnosCreditosController.$injet = ['LxDialogService', 'LxDatePickerService', '$http', '$httpParamSerializerJQLike', 
                                        'SessionService', '$sope', '$filter', 'LxNotificationService'];

    function alumnosCreditosController(LxDialogService, LxDatePickerService, $http, $httpParamSerializerJQLike, 
                                        SessionService, $scope, $filter, LxNotificationService) {
        //var vm = this;
        var vm = this;
        vm.showLinearProgress = false;
        vm.enviado = false;
        vm.botonCreditos = false;
        vm.formaActiva = true;
        vm.idConstancia = 0;
        vm.alumnoValidado = SessionService.sessionAlumno();
        // vm.enviarDatos = enviarDatos;
        vm.cancelarDatos = cancelarDatos;
        vm.verConstancia = verConstancia;
        vm.cancelMouseover = cancelMouseover;
        vm.leerCreditos = leerCreditos;
        vm.scrollDown = scrollDown;
        
        //console.log(vm.usuarioValidado);
        vm.creditoTableThead = [
            {   name: 'reg',       label: 'NO.',   sortable: true, width: '10%' },
            {   name: 'evento', label: 'EVENTO', sortable: true, width: '60%'  },
            {   name: 'fecha',   label: 'FECHA',  sortable: true, sort: 'asc', width: "20%" },
            {   name: 'creditos', label: 'ACADÉMICOS', sortable: true, width: "10%" }
        ];
        vm.creditoTableTbody = [];
        vm.creditoTableTfoot = [];
        
        vm.culturalTableThead = [
            {   name: 'reg',       label: 'NO.',   sortable: true, width: '10%' },
            {   name: 'evento', label: 'EVENTO', sortable: true, width: '60%'  },
            {   name: 'fecha',   label: 'FECHA',  sortable: true, sort: 'asc', width: "20%" },
            {   name: 'creditos', label: 'CULTURALES', sortable: true, width: "10%" }
        ];
        vm.culturalTableTbody = [];
        vm.culturalTableTfoot = [];
        
        vm.deporteTableThead = [
            {   name: 'reg',       label: 'NO.',   sortable: true, width: '10%' },
            {   name: 'evento', label: 'EVENTO', sortable: true, width: '60%'  },
            {   name: 'fecha',   label: 'FECHA',  sortable: true, sort: 'asc', width: "20%" },
            {   name: 'creditos', label: 'DEPORTIVOS', sortable: true, width: "10%" }
        ];
        vm.deporteTableTbody = [];
        vm.deporteTableTfoot = [];
        
        $scope.$on('lx-data-table__selected', updateActions);
        $scope.$on('lx-data-table__unselected', updateActions);
        $scope.$on('lx-data-table__sorted', updateSort);

        ////////////

        if (vm.alumnoValidado) { // si inicio sesión normal
            leerCreditos();
        }

        function updateActions(_event, _dataTableId, _selectedRows) {
            if (_dataTableId === 'creditos') {
                vm.selectedCons = _selectedRows;
            } else if (_dataTableId === 'cultural') {
                vm.selectedCons = _selectedRows;
            } else if (_dataTableId === 'deporte') {
                vm.selectedCons = _selectedRows;
            }
        }

        function updateSort(_event, _dataTableId, _column) {
            if (_dataTableId === 'creditos') {
                vm.creditoTableTbody = $filter('orderBy')(vm.creditoTableTbody, _column.name, _column.sort === 'desc' ? true : false);
            } else if (_dataTableId === 'cultural') {
                vm.culturalTableTbody = $filter('orderBy')(vm.culturalTableTbody, _column.name, _column.sort === 'desc' ? true : false);
            } else if (_dataTableId === 'deporte') {
                vm.deporteTableTbody = $filter('orderBy')(vm.deporteTableTbody, _column.name, _column.sort === 'desc' ? true : false);
            }

        }

        function leerCreditos() {        // recupera los datos y los envÃ­a al API / BD
            // validar los datos antes de ser enviados...
            var noError = true;
            var errorText = "Error: <br>";
            var totalCreditos;

            if (noError) {
                
                var datosEnviar = { "registrar"  : "LeerCreditos"   };
                
                vm.showLinearProgress = true;       // progress...
                vm.enviado = true;

                $http({
                    method: 'POST',
                    timeout: 90000,
                    data: $httpParamSerializerJQLike(datosEnviar),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                    url: '/siiFCA/api/leer_creditos_alumno.php'
                })
                .then( function ok(resp) {
                    vm.showLinearProgress = false;
                    vm.enviado = false;
                    var r = resp.data;
                    // vm.formaActiva = true;
                    if (r.status == 'Ok') {
                        // $('div#msgInfo').html(r.data);
                        // console.log( $cookies.get('siifca_sid'));
                        vm.creditoTableTbody = r.creditosa;
                        vm.creditoTableTfoot = r.sumasa;
                        vm.culturalTableTbody = r.creditosc;
                        vm.culturalTableTfoot = r.sumasc;
                        vm.deporteTableTbody = r.creditosd;
                        vm.deporteTableTfoot = r.sumasd;
                        // console.log( r.sumasa, r.sumasc, r.sumasd[0].creditos );
                        totalCreditos = (r.sumasa[0].creditos > 30 ? 30 : r.sumasa[0].creditos) + 
                                        (r.sumasc[0].creditos > 15 ? 15 : r.sumasc[0].creditos) + 
                                        (r.sumasd[0].creditos > 15 ? 15 : r.sumasd[0].creditos);

                        // activa el botón para ver la constancia...
                        vm.idConstancia = r.constancia;
                        vm.botonCreditos = (totalCreditos >= 48 ) ? true : false ;
                        // console.log( vm.idConstancia , '==', r.constancia);
                    } else {
                        $('div#msgError').html('<b>Error:</b><br>' + r.error);
                        // vm.htmlmsg = resp.data;
                        LxDialogService.open('dlgError');
                        
                     }
                    
                    }, function error(resp) {
                        vm.showLinearProgress = false;
                        vm.enviado = false;
                        var r = resp.data;
                        // console.log(resp);
                        $('div#msgError').html('<b>Error:</b><br>' + r.data);
                        // vm.htmlmsg = resp.data;
                        LxDialogService.open('dlgError');
                        // cbExpiration();
                });
            } else {
                $('div#msgError').html(errorText);
                //vm.msg = errorText;
                LxDialogService.open('dlgError');
            }
        }

        function verConstancia(tipo) {        // recupera los datos y los enví­a al API / BD
            // validar los datos antes de ser enviados...
                        
            var noError = true;
            var errorText = "Error: <br>";
            //console.log(vm.selectedCons[0].codigo);
            if (noError) {
                
                var datosEnviar = { 
                                    "idc"       : vm.idConstancia,
                                   "registrar"  : "VerConsCreditos"
                };
                // console.log(datosEnviar.recaptcha_response);
                vm.showLinearProgress = true;       // progress...
                vm.enviado = true;

                $http({
                    method: 'POST',
                    timeout: 50000,
                    data: $httpParamSerializerJQLike(datosEnviar),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                    url: '/siiFCA/api/ver_conscreditos_alumno.php'
                })
                .then( function ok(resp) {
                    vm.showLinearProgress = false;
                    vm.enviado = false;
                    var r = resp.data;
                    //vm.formaActiva = true;
                    if (r.status == 'Ok') {
                        //$('div#msgInfo').html(r.data);
                    
                        var wpdf = window.open(r.urlData, "_blank");
                        if (!wpdf || wpdf.closed || typeof wpdf.closed=='undefined'){
                            LxNotificationService.notify('Activar las ventanas emergentes del navegador...', undefined, undefined, undefined, undefined, undefined, 5000);
                        } else {
                            LxNotificationService.success('Constancia generada...!!');
                        }
                    } else {
                        $('div#msgError').html('<b>Error:</b><br>' + r.data + r.error);
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
            } else {
                $('div#msgError').html(errorText);
                //vm.msg = errorText;
                LxDialogService.open('dlgError');
            }
        }

        
        function cancelarDatos() {

            //vm.widgetId = null;

            vm.showLinearProgress = false;		// progress...
            vm.enviado = false;
            //vm.formaActiva = true;
        }

        function scrollDown() {
             $("body").trigger($.Event("keyup", { keyCode: 40 }));
        }

        function cancelMouseover(_event){
            _event.preventDefault();
            _event.stopImmediatePropagation();
        }
 

        function openFechaDialog(_id){
            LxDatePickerService.open(_id);
        }

    }

})();
