(function() {
    'use strict';

    angular.module('Controllers')
        .controller('adminUserEventosController', adminUserEventosController);

    adminUserEventosController.$injet = ['LxDialogService', '$http', '$httpParamSerializerJQLike', '$filter',
                                        'SessionService', '$scope', 'LxDataTableService'];

    function adminUserEventosController(LxDialogService, $http, $httpParamSerializerJQLike, $filter,
                                        SessionService, $scope, LxDataTableService) { // pendiente del LxDataTableService
        var vm = this;
        var fechaActual = new Date();

        vm.showLinearProgress = false;
        vm.enviado = false;
        vm.formaActiva = true;
        vm.hayEventos = false;
        vm.activeTab = 0;
        vm.offset = 0;
        vm.tope = 0;
        vm.year = fechaActual.getFullYear();
        vm.nuevoEvento = false;
        vm.modificaEvento = false;
        vm.clonaEvento = false;
        vm.borraEvento = false;
        vm.userValidado = SessionService.sessionUser();
        vm.permisos = JSON.parse(SessionService.sessionPermisos());
        vm.leerEventos = leerEventos;
        vm.newEvento = newEvento;
        vm.guardarNuevoEvento = guardarNuevoEvento;
        vm.guardarClonEvento = guardarClonEvento;
        vm.editarEvento = editarEvento;
        vm.clonarEvento = clonarEvento;
        vm.borrarEvento = borrarEvento;
        vm.buscarYear = buscarYear;
        vm.guardarEdicionEvento = guardarEdicionEvento;
        vm.cancelarEdicionEvento = cancelarEdicionEvento;
        vm.guardarEdicionEvento = guardarEdicionEvento;
        vm.guardarBorrarEvento = guardarBorrarEvento;
        vm.cancelarNuevoEvento = cancelarNuevoEvento;
        vm.cancelarClonEvento = cancelarClonEvento;
        vm.cancelarBorrarEvento = cancelarBorrarEvento;
        vm.siguienteOffset = siguienteOffset;
        vm.anteriorOffset = anteriorOffset;
        // vm.cancelarDatos = cancelarDatos;
        vm.cancelMouseover = cancelMouseover;
        vm.scrollDown = scrollDown;

        //console.log(vm.alumnoValidado);
        cancelarDatos();

        if (vm.userValidado && !vm.hayEventos) {
            leerEventos();          // lee eventos la primera vez que carga...
        }

        vm.dataTableThead = [
            {   name: 'id',     label: 'IDE.',   sortable: true, width: '10%' },
            {   name: 'categoria',  label: 'CATEGORIA', sortable: true, sort: 'des', width: '22%'  },
            {   name: 'evento',  label: 'EVENTO', sortable: true, width: '50%' },
            {   name: 'fecha',  label: 'FECHA', sortable: true, width: '18%' }
        ];

        vm.dataTableTbody = [];
        vm.rs = [];
        
        $scope.$on('lx-data-table__selected', updateActions);
        $scope.$on('lx-data-table__unselected', updateActions);
        $scope.$on('lx-data-table__sorted', updateSort);

        ////////////

        function updateActions(_event, _dataTableId, _selectedRows) {
            if (_dataTableId === 'eventos') {
                if (_event.name === 'lx-data-table__selected' && _selectedRows.length >1) {
                    LxDataTableService.unselect(_dataTableId, _selectedRows[0]);
                 }
                vm.selectedCons = _selectedRows;
                // console.log(_selectedRows);
            }
        }

        function updateSort(_event, _dataTableId, _column) {
            if (_dataTableId === 'eventos') {
                vm.dataTableTbody = $filter('orderBy')(vm.dataTableTbody, _column.name, _column.sort === 'desc' ? true : false);
            }
        }

        // modifica el registro=evento seleccionado...
        function editarEvento() {
            // leee el evento seleccionado
            leerEventoID( vm.selectedCons[0].id );
            vm.modificaEvento = true;
            vm.activeTab = 1;
            // console.log( "PRIMERO ", vm.evento );   // 2do.
        }

        function clonarEvento() {
            // leee el evento seleccionado
            leerEventoID( vm.selectedCons[0].id );
            vm.clonaEvento = true;
            vm.activeTab = 1;
            // console.log( "PRIMERO ", vm.evento );   // 2do.
        }

        function newEvento() {
            // leee el evento seleccionado
            cancelarDatos();
            vm.nuevoEvento = true;
            vm.activeTab = 1;
            // console.log( "PRIMERO ", vm.evento );   // 2do.
        }

        // cancela la edición del registro=evento seleccionado...
        function cancelarEdicionEvento() {
            vm.modificaEvento = false;
            vm.activeTab = 0;
            // console.log( "PRIMERO ", vm.evento );   // 2do.
            // leerEventos();
            // LxDataTableService.select('eventos', vm.selectedCons);
            // vm.dataTableTbody[0].lxDataTableSelected = true;
            // $scope.$emit('lx-data-table__selected', 'eventos', vm.dataTableTbody[0])
            // console.log(vm.dataTableTbody);
        }

        function cancelarNuevoEvento() {
            vm.nuevoEvento = false;
            vm.activeTab = 0;
            // console.log( "PRIMERO ", vm.evento );   // 2do.
            // vm.selectedCons = [];
        }

        function cancelarClonEvento() {
            vm.clonaEvento = false;
            vm.activeTab = 0;
            // console.log( "PRIMERO ", vm.evento );   // 2do.
            // vm.selectedCons = [];
        }

        // borrar el registro=evento seleccionado...
        function borrarEvento() {
            vm.borraEvento = true;
            vm.activeTab = 1;
            leerEventoID( vm.selectedCons[0].id );
            vm.selectedCons = [];
        }

        // Siguiente Offset de eventos...
        function siguienteOffset() {
            vm.activeTab = 0;
            if ((vm.offset+10) <= vm.tope) {
                vm.offset += 10;
                leerEventos();
            } else {
                vm.offset = vm.tope - vm.tope % 10;
            }
            // vm.selectedCons = [];
        }

        // anterior Offset de eventos...
        function anteriorOffset() {
            vm.activeTab = 0;
            if (vm.offset >= 10) {
                vm.offset -= 10;
            } else {
                vm.offset = 0;
            }
            leerEventos();

            // vm.selectedCons = [];
        }

        // Buscar eventos por año...
        function buscarYear() {
            vm.activeTab = 0;
            vm.offset = 0;
            leerEventos();
            // vm.selectedCons = [];
        }

        // cancelar borrar el registro=evento seleccionado...
        function cancelarBorrarEvento() {
            vm.borraEvento = false;
            vm.activeTab = 0;
            leerEventos();
            vm.selectedCons = [];
        }

        function leerEventos() { 
            // validar los datos antes de ser enviados...
                
            var datosEnviar = { "offset" : vm.offset, "year" : vm.year, "registrar"  : "leerEventos" };
            // console.log(datosEnviar.recaptcha_response);
            vm.showLinearProgress = true;       // progress...
            vm.enviado = true;

            $http({
                method: 'POST',
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/leer_eventos_admin.php'
            })
            .then( function ok(resp) {
                vm.showLinearProgress = false;
                vm.enviado = false;
                vm.rs = resp.data;
                //vm.formaActiva = true;
                if (resp.status === 200 && vm.rs.status === 'Ok') {
                    vm.dataTableTbody = vm.rs.eventos;
                    vm.tope = parseInt(vm.rs.tope);
                    vm.selectedCons = [];
                    // vm.eventos = r.eventos;
                    vm.hayEventos = true;
                } else {
                    $('div#msgError').html('<b>Error:</b><br>' + vm.rs.error);
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

        // llena el arreglo vm.eventos a partir de un id (idevento)
        function leerEventoID(ide) { 
            // validar los datos antes de ser enviados...
                
            var datosEnviar = { "idevento": ide, "registrar"  : "leerEventoxID" };
            
            vm.showLinearProgress = true;       // progress...
            vm.enviado = true;

            $http({
                method: 'POST',
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/leer_evento_id_admin.php'
            })
            .then( function ok(resp) {
                vm.showLinearProgress = false;
                vm.enviado = false;
                var r = resp.data;
                //vm.formaActiva = true;
                if (resp.status === 200 && r.status === 'Ok') {
                    vm.evento = r.evento;
                    // vm.evento.fecha = new Date(vm.evento.fecha);
                    // vm.evento.inicioreg = new Date(vm.evento.inicioreg);
                    // vm.evento.finreg    = new Date(vm.evento.finreg);
                    vm.evento.idevento  = parseInt(vm.evento.idevento);
                    vm.evento.creditosa = parseInt(vm.evento.creditosa);
                    vm.evento.creditosc = parseInt(vm.evento.creditosc);
                    vm.evento.creditosd = parseInt(vm.evento.creditosd);
                    vm.evento.cupoalu   = parseInt(vm.evento.cupoalu);
                    vm.evento.cupodoc   = parseInt(vm.evento.cupodoc);
                    vm.evento.cupoadm   = parseInt(vm.evento.cupoadm);
                    vm.evento.cupoinv   = parseInt(vm.evento.cupoinv);
                    vm.evento.cupopub   = parseInt(vm.evento.cupopub);
                    vm.evento.status    = parseInt(vm.evento.status); 
                    // console.log( vm.evento );
                    // vm.hayEventos = true;
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

        function guardarEdicionEvento() { 
            // validar los datos antes de ser enviados...
                
            var datosEnviar = {  "idevento" : vm.evento.idevento,
                                "categoria" : vm.evento.categoria,
                                   "evento" : vm.evento.evento,
                                    "fecha" : vm.evento.fecha,
                                     "hora" : vm.evento.hora,
                                    "lugar" : vm.evento.lugar,
                                "expositor" : vm.evento.expositor,
                                    "turno" : vm.evento.turno,
                               "creditosac" : vm.evento.creditosa,
                               "creditossc" : vm.evento.creditosc,
                               "creditosde" : vm.evento.creditosd,
                                  "cupoalu" : vm.evento.cupoalu,
                                  "cupodoc" : vm.evento.cupodoc,
                                  "cupoadm" : vm.evento.cupoadm,
                                  "cupoinv" : vm.evento.cupoinv,
                                  "cupopub" : vm.evento.cupopub,
                                "inicioreg" : vm.evento.inicioreg,
                                   "finreg" : vm.evento.finreg,
                                    "notas" : vm.evento.notas,
                                   "status" : vm.evento.status,
                                "registrar" : "guardarEvento",
                                   "accion" : "update"
                              };
            // console.log(datosEnviar.recaptcha_response);
            vm.showLinearProgress = true;       // progress...
            vm.enviado = true;

            $http({
                method: 'POST',
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/guarda_evento_admin.php'
            })
            .then( function ok(resp) {
                vm.showLinearProgress = false;
                vm.enviado = false;
                var r = resp.data;
                //vm.formaActiva = true;
                if (resp.status === 200 && r.status === 'Ok') {
                    $('div#msgInfo').html(r.data);
                    LxDialogService.open('dlgInfo');
                    // volver a leer los eventos por los cambios guardados...
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

        function guardarNuevoEvento() { 
            // validar los datos antes de ser enviados...
                
            var datosEnviar = {  "idevento" : vm.evento.idevento,
                                "categoria" : vm.evento.categoria,
                                   "evento" : vm.evento.evento,
                                    "fecha" : vm.evento.fecha,
                                     "hora" : vm.evento.hora,
                                    "lugar" : vm.evento.lugar,
                                "expositor" : vm.evento.expositor,
                                    "turno" : vm.evento.turno,
                               "creditosac" : vm.evento.creditosa,
                               "creditossc" : vm.evento.creditosc,
                               "creditosde" : vm.evento.creditosd,
                                  "cupoalu" : vm.evento.cupoalu,
                                  "cupodoc" : vm.evento.cupodoc,
                                  "cupoadm" : vm.evento.cupoadm,
                                  "cupoinv" : vm.evento.cupoinv,
                                  "cupopub" : vm.evento.cupopub,
                                "inicioreg" : vm.evento.inicioreg,
                                   "finreg" : vm.evento.finreg,
                                    "notas" : vm.evento.notas,
                                   "status" : vm.evento.status,
                                "registrar" : "guardarEvento",
                                   "accion" : "insert"
                              };
            // console.log(datosEnviar.recaptcha_response);
            vm.showLinearProgress = true;       // progress...
            vm.enviado = true;

            $http({
                method: 'POST',
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/guarda_evento_admin.php'
            })
            .then( function ok(resp) {
                vm.showLinearProgress = false;
                vm.enviado = false;
                var r = resp.data;
                //vm.formaActiva = true;
                if (resp.status === 200 && r.status === 'Ok') {
                    $('div#msgInfo').html(r.data);
                    LxDialogService.open('dlgInfo');
                    // volver a leer los eventos por los cambios guardados...
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

        function guardarClonEvento() { 
            // validar los datos antes de ser enviados...
                
            var datosEnviar = {  "idevento" : vm.evento.idevento,
                                "categoria" : vm.evento.categoria,
                                   "evento" : vm.evento.evento,
                                    "fecha" : vm.evento.fecha,
                                     "hora" : vm.evento.hora,
                                    "lugar" : vm.evento.lugar,
                                "expositor" : vm.evento.expositor,
                                    "turno" : vm.evento.turno,
                               "creditosac" : vm.evento.creditosa,
                               "creditossc" : vm.evento.creditosc,
                               "creditosde" : vm.evento.creditosd,
                                  "cupoalu" : vm.evento.cupoalu,
                                  "cupodoc" : vm.evento.cupodoc,
                                  "cupoadm" : vm.evento.cupoadm,
                                  "cupoinv" : vm.evento.cupoinv,
                                  "cupopub" : vm.evento.cupopub,
                                "inicioreg" : vm.evento.inicioreg,
                                   "finreg" : vm.evento.finreg,
                                    "notas" : vm.evento.notas,
                                   "status" : vm.evento.status,
                                "registrar" : "guardarEvento",
                                   "accion" : "insert"
                              };
            // console.log(datosEnviar.recaptcha_response);
            vm.showLinearProgress = true;       // progress...
            vm.enviado = true;

            $http({
                method: 'POST',
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/guarda_evento_admin.php'
            })
            .then( function ok(resp) {
                vm.showLinearProgress = false;
                vm.enviado = false;
                var r = resp.data;
                //vm.formaActiva = true;
                if (resp.status === 200 && r.status === 'Ok') {
                    $('div#msgInfo').html(r.data);
                    LxDialogService.open('dlgInfo');
                    // volver a leer los eventos por los cambios guardados...
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

        function guardarBorrarEvento() { 
            // validar los datos antes de ser enviados...
                
            var datosEnviar = {  "idevento" : vm.evento.idevento,
                                "registrar" : "guardarEvento",
                                   "accion" : "delete"
                              };
            // console.log(datosEnviar.recaptcha_response);
            vm.showLinearProgress = true;       // progress...
            vm.enviado = true;

            $http({
                method: 'POST',
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/guarda_evento_admin.php'
            })
            .then( function ok(resp) {
                vm.showLinearProgress = false;
                vm.enviado = false;
                var r = resp.data;
                //vm.formaActiva = true;
                if (resp.status === 200 && r.status === 'Ok') {
                    $('div#msgInfo').html(r.data);
                    LxDialogService.open('dlgInfo');
                    // volver a leer los eventos por los cambios guardados...
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

        function cancelarDatos() {
            vm.showLinearProgress = false;		// progress...
            vm.enviado = false;
            //vm.formaActiva = true;
            vm.evento =  {
                idevento: 0,
                categoria: "",
                evento: "",
                fecha: "",
                hora: "",
                lugar: "",
                expositor: "",
                turno: "",
                creditosa: 0,
                creditosc: 0,
                creditosd: 0,
                cupoalu: 0,
                cupodoc: 0,
                cupoadm: 0,
                cupoinv: 0,
                cupopub: 0,
                inicioreg: "",
                finreg: "",
                notas: "",
                status: 1
            } ;
    
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
