(function() {
    'use strict';

    angular.module('Controllers')
        .controller('alumnosConstanciasController', alumnosConstanciasController);

    alumnosConstanciasController.$injet = ['LxDialogService', '$http', '$httpParamSerializerJQLike', 'LxDataTableService',
                'SessionService', '$filter', '$scope', 'LxNotificationService'];

    function alumnosConstanciasController(LxDialogService, $http, $httpParamSerializerJQLike, LxDataTableService,
                            SessionService, $filter, $scope, LxNotificationService) {
        //var vm = this;
        var vm = this;
        vm.showLinearProgress = false;
        vm.enviado = false;
        vm.formaActiva = true;
        vm.selectedCons = [];
        vm.selectedConsExt = [];
        vm.alumnoValidado = SessionService.sessionAlumno();
        vm.cancelarDatos = cancelarDatos;
        vm.leerConstancias = leerConstancias;
        vm.verConstancia = verConstancia;
        vm.cancelMouseover = cancelMouseover;
        vm.scrollDown = scrollDown;
        
        //console.log(vm.usuarioValidado);

        vm.dataTableThead = [
            {   name: 'id',     label: 'NO.',    sortable: true, width: '10%' },
            {   name: 'evento', label: 'EVENTO', sortable: true, width: '55%'  },
            {   name: 'fecha',  label: 'FECHA',  sortable: true, sort: 'asc', width: "25%" },
            {   name: 'codigo', label: 'CÓDIGO', sortable: true, width: "10%" }
        ];
        vm.dataTableTheadExt = [
            {   name: 'id',     label: 'NO.',    sortable: true, width: '10%' },
            {   name: 'evento', label: 'EVENTO/CURSO', sortable: true, width: '55%'  },
            {   name: 'fecha',  label: 'FECHA',  sortable: true, sort: 'asc', width: "25%" },
            {   name: 'codigo', label: 'CÓDIGO', sortable: true, width: "10%" }
        ];
        vm.dataTableTbody    = [];
        vm.dataTableTbodyExt = [];
        
        $scope.$on('lx-data-table__selected', updateActions);
        $scope.$on('lx-data-table__unselected', updateActions);
        $scope.$on('lx-data-table__sorted', updateSort);

        ////////////

        if (vm.alumnoValidado) { // si inicio sesión normal
            leerConstancias();
        }

        function updateActions(_event, _dataTableId, _selectedRows) {
            if (_dataTableId === 'constancias') {
                if (_event.name === 'lx-data-table__selected' && _selectedRows.length >1) {
                    LxDataTableService.unselect(_dataTableId, _selectedRows[0]);
                 }
                vm.selectedCons = _selectedRows;
                // console.log(_selectedRows);
            }
            if (_dataTableId === 'constanciasExt') {
                if (_event.name === 'lx-data-table__selected' && _selectedRows.length >1) {
                    LxDataTableService.unselect(_dataTableId, _selectedRows[0]);
                 }
                vm.selectedConsExt = _selectedRows;
                // console.log(_selectedRows);
            }
        }

        function updateSort(_event, _dataTableId, _column) {
            if (_dataTableId === 'constancias') {
                vm.dataTableTbody = $filter('orderBy')(vm.dataTableTbody, _column.name, _column.sort === 'desc' ? true : false);
            } else {
                vm.dataTableTbodyExt = $filter('orderBy')(vm.dataTableTbodyExt, _column.name, _column.sort === 'desc' ? true : false);
            }
        }
        
        function leerConstancias() {        // recupera los datos y los enví­a al API / BD
            // validar los datos antes de ser enviados...
            var noError = true;
            var errorText = "Error: <br>";

            if (noError) {
                var datosEnviar = { 
                                   "registrar"  : "LeerConstancias"
                };
                // console.log(datosEnviar.recaptcha_response);
                vm.showLinearProgress = true;       // progress...
                vm.enviado = true;

                $http({
                    method: 'POST',
                    timeout: 90000,
                    data: $httpParamSerializerJQLike(datosEnviar),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                    url: '/siiFCA/api/leer_constancias_alumno.php'
                })
                .then( function ok(resp) {
                    vm.showLinearProgress = false;
                    vm.enviado = false;
                    var r = resp.data;
                    //vm.formaActiva = true;
                    if (r.status == 'Ok') {
                        //$('div#msgInfo').html(r.data);
                        vm.dataTableTbody = r.constancias;
                        vm.dataTableTbodyExt = r.constanciasExt;
                        //LxDialogService.open('dlgInfo');
                        //vm.usuarioValidado = SessionService.sessionState();
                        //vm.cancelarDatos();
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
            } else {
                $('div#msgError').html(errorText);
                //vm.msg = errorText;
                LxDialogService.open('dlgError');
            }
        }

        function verConstancia(tipo) {        // recupera los datos y los enví­a al API / BD; tipo 1 interna, 2 = externa
            // validar los datos antes de ser enviados...
                        
            var noError = true;
            var errorText = "Error: <br>";
            //console.log(vm.selectedCons[0].codigo);
            if (noError) {
                
                var datosEnviar = { "tipo"      : tipo,
                                    "idc"       : (tipo == 1) ? vm.selectedCons[0].codigo : vm.selectedConsExt[0].codigo,
                                   "registrar"  : "VerConstancia"
                };
                // console.log(datosEnviar.recaptcha_response);
                vm.showLinearProgress = true;       // progress...
                vm.enviado = true;

                $http({
                    method: 'POST',
                    timeout: 50000,
                    data: $httpParamSerializerJQLike(datosEnviar),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                    url: '/siiFCA/api/ver_constancia_alumno.php'
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
                            if (tipo == 1) {
                                LxNotificationService.success('Constancia generada...!!');
                            } else {
                                LxNotificationService.success('Constancia mostrada en pestaña...!!');
                            }
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
            } else {
                $('div#msgError').html(errorText);
                //vm.msg = errorText;
                LxDialogService.open('dlgError');
            }
        }

        function cancelarDatos() {

            vm.campos = {
            };

            //cbExpiration();
            //vm.widgetId = null;

            vm.showLinearProgress = false;		// progress...
            vm.enviado = false;
            //vm.formaActiva = true;
        }

        function scrollDown() {
             $("body").trigger($.Event("keyup", { keyCode: 40 }));
        }

        // validación del correo...
        function emailValidation(_email) {
            return /^[0-9a-zA-Z]+([0-9a-zA-Z]*[-._+])*[0-9a-zA-Z]+@[0-9a-zA-Z]+([-.][0-9a-zA-Z]+)*([0-9a-zA-Z]*[.])[a-zA-Z]{2,6}$/.test(_email);
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
