(function() {
    'use strict';

    angular.module('Controllers')
        .controller('adminUserRecibosController', adminUserRecibosController);

    adminUserRecibosController.$injet = ['LxDialogService', '$http', '$httpParamSerializerJQLike', 
                'SessionService', '$filter', '$scope', 'LxNotificationService'];

    function adminUserRecibosController(LxDialogService, $http, $httpParamSerializerJQLike, 
                            SessionService, $filter, $scope, LxNotificationService) {
        //var vm = this;
        var vm = this;
        vm.showLinearProgress = false;
        vm.enviado = false;
        vm.formaActiva = true;
        vm.selectedCons = [];
        vm.userValidado = SessionService.sessionUser();
        vm.permisos = JSON.parse(SessionService.sessionPermisos());
        vm.validarEmail = validarEmail;
        vm.validarEmail2 = validarEmail2;
        vm.cancelarDatos = cancelarDatos;
//        vm.leerConstancias = leerConstancias;
        vm.enviarConsulta = enviarConsulta;
        vm.cancelMouseover = cancelMouseover;
        vm.scrollDown = scrollDown;
        
        // console.log(vm.permisos.recibos);
        // vm.permisos = {"tipo": null, "recibos": true };

        vm.campos = {
            cuenta: ""
        }

        vm.dataTableThead = [
            {   name: 'idmov',     label: 'NO.',    sortable: true, width: '10%' },
            {   name: 'cargo', label: 'CARGOS', sortable: true, width: '20%'  },
            {   name: 'abono', label: 'ABONOS', sortable: true, width: "20%" },
            {   name: 'fecha',  label: 'FECHA',  sortable: true, sort: 'asc', width: "20%" },
            {   name: 'notas', label: 'NOTAS',  sortable: true, width: "30%" },
        ];
        vm.dataTableTbody = [];
        
        $scope.$on('lx-data-table__selected', updateActions);
        $scope.$on('lx-data-table__unselected', updateActions);
        $scope.$on('lx-data-table__sorted', updateSort);

        ////////////
/*
        if (vm.userValidado) { // si inicio sesión normal
            leerConstancias();
        }
*/
        function updateActions(_event, _dataTableId, _selectedRows) {
            if (_dataTableId === 'estadocuenta') {
                vm.selectedCons = _selectedRows;
            }
        }

        function updateSort(_event, _dataTableId, _column) {
            vm.dataTableTbody = $filter('orderBy')(vm.dataTableTbody, _column.name, _column.sort === 'desc' ? true : false);
        }
        
        function enviarConsulta() {        // recupera los datos y los enví­a al API / BD
            // validar los datos antes de ser enviados...
            var noError = true;
            var errorText = "Error: <br>";

            if (vm.campos.cuenta === '' || vm.campos.cuenta.length < 8) {
                noError = false;
                errorText += "Número de Cuenta INCORRECTO";
            }

            if (noError) {
                var datosEnviar = { "cuenta": vm.campos.cuenta,
                                    "registrar"  : "LeerRecibo"
                };
                // console.log(datosEnviar.recaptcha_response);
                vm.showLinearProgress = true;       // progress...
                vm.enviado = true;

                $http({
                    method: 'POST',
                    timeout: 15000,
                    data: $httpParamSerializerJQLike(datosEnviar),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                    url: '/siiFCA/api/leer_recibo_admin.php'
                })
                .then( function ok(resp) {
                    vm.showLinearProgress = false;
                    vm.enviado = false;
                    var r = resp.data;
                    //vm.formaActiva = true;
                    if (r.status == 'Ok') {
                        console.log( r.movimientos );
                        vm.dataTableTbody = r.movimientos;

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
                        $('div#msgError').html('<b>Error:</b><br>' + resp);
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

        function validarEmail() {
            return (vm.campos.correoi !== "" && vm.campos.correoi !== undefined) ? emailValidation(vm.campos.correoi) : true;
        }

        function validarEmail2() {
            return (vm.campos.correop !== "" && vm.campos.correop !== undefined) ? emailValidation(vm.campos.correop) : true;
        }

        function verRecibos() {        // recupera los datos y los enví­a al API / BD
            // validar los datos antes de ser enviados...
                        
            var noError = true;
            var errorText = "Error: <br>";
            //console.log(vm.selectedCons[0].codigo);
            if (noError) {
                
                var datosEnviar = { 
                                    "idc"       : vm.selectedCons[0].codigo,
                                   "registrar"  : "VerConstancia"
                };
                // console.log(datosEnviar.recaptcha_response);
                vm.showLinearProgress = true;       // progress...
                vm.enviado = true;

                $http({
                    method: 'POST',
                    timeout: 15000,
                    data: $httpParamSerializerJQLike(datosEnviar),
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                    url: '/siiFCA/api/ver_constancia_admin.php'
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
                            LxNotificationService.notify('Activar las ventanas emergentes del navegador...', undefined, undefined, undefined, undefined, undefined, 10000);
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
 
    }

})();
