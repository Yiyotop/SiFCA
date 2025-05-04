(function() {
    'use strict';

    angular.module('Controllers')
        .controller('adminUserConstanciasController', adminUserConstanciasController);

    adminUserConstanciasController.$injet = ['LxDialogService', '$http', '$httpParamSerializerJQLike', '$filter', '$timeout',
                                            'SessionService', '$scope', 'LxDataTableService'];

function adminUserConstanciasController(LxDialogService, $http, $httpParamSerializerJQLike, $filter, $timeout,
                                        SessionService, $scope, LxDataTableService) { // pendiente del LxDataTableService
        var vm = this;
        var fechaActual = new Date();

        vm.showLinearProgress = false;
        vm.enviado = false;
        vm.formaActiva = true;
        vm.hayConstancias = false;
        vm.activeTab = 0;
        vm.activeTabGen = 0;
        vm.offset = 0;
        vm.tope = 0;
        vm.tipo = 'alumnos';
        vm.year = fechaActual.getFullYear();
        vm.nuevaConstancia = false;
        vm.modificaConstancia = false;
        vm.clonaConstancia = false;
        vm.borraConstancia = false;
        vm.subePlantilla = false;
        vm.showCircularProgress = false;
        vm.archivo = null;
        vm.userValidado = SessionService.sessionUser();
        vm.permisos = JSON.parse(SessionService.sessionPermisos());
        vm.leerConstancias = leerConstancias;
        vm.newConstancia = newConstancia;
        vm.guardarNuevaConsta = guardarNuevaConsta;
        vm.guardarClonConsta = guardarClonConsta;
        vm.editarConstancia = editarConstancia;
        vm.clonarConstancia = clonarConstancia;
        vm.borrarConstancia= borrarConstancia;
        vm.buscarYear = buscarYear;
        vm.guardarEdicionConsta = guardarEdicionConsta;
        vm.cancelarEdicionConsta = cancelarEdicionConsta;
        vm.guardarEdicionConsta = guardarEdicionConsta;
        vm.guardarBorrarConsta= guardarBorrarConsta;
        vm.cancelarNuevaConsta = cancelarNuevaConsta;
        vm.cancelarClonConsta = cancelarClonConsta;
        vm.cancelarBorrarConsta = cancelarBorrarConsta;
        vm.subirPlantilla = subirPlantilla;
        vm.manejaArchivo = manejaArchivo;
        vm.enviaPlantilla = enviaPlantilla;
        vm.cierraEnvioPlantilla = cierraEnvioPlantilla;
        vm.siguienteOffset = siguienteOffset;
        vm.anteriorOffset = anteriorOffset;
        vm.callbackPlantilla = callbackPlantilla;
        // vm.cancelarDatos = cancelarDatos;
        vm.cancelMouseover = cancelMouseover;
        vm.scrollDown = scrollDown;
        vm.pasteAlumnos = pasteAlumnos;
        vm.pasteDocentes = pasteDocentes;
        vm.pasteAdvos = pasteAdvos;
        vm.genAlumnosCons = genAlumnosCons;
        vm.verListaConstancias = verListaCons;
        vm.genDocentesCons = genDocentesCons;
        vm.genAdvosCons = genAdvosCons;
        vm.cleanLista = cleanLista;
        vm.cambiaEvento = cambiaEvento;
        vm.borrarAsistencia = borrarAsistencia;

        vm.selectPlantilla = [];
        vm.alumnos = null;
        vm.idevento = null;

        vm.selectStatus  = [ 
            { "name" : "BAJA",     "id": 0 },
            { "name" : "NORMAL",   "id": 1 }, 
            { "name" : "CRÉDITOS", "id": 2 }, 
            { "name" : "ESPECIAL", "id": 3 } 
        ];
        //console.log(vm.alumnoValidado);
        cancelarDatos();

        if (vm.userValidado && !vm.hayConstancias) {
            leerConstancias();          // lee constancias la primera vez que carga...
        }

        vm.dataTableThead = [
            {   name: 'idc',     label: 'IDC',   sortable: true, width: '08%' },
            {   name: 'idevento',  label: 'IDEVENTO', sortable: true, sort: 'des', width: '10%'  },
            {   name: 'categoria',  label: 'CATEGORIA', sortable: true, width: '20%' },
            {   name: 'evento',  label: 'EVENTO', sortable: true, width: '47%' },
            {   name: 'fecha',  label: 'FECHA', sortable: true, width: '15%' }
        ];

        vm.tablaAlumnosTH = [
            {   name: 'cuenta',     label: 'CUENTA',   sortable: true, width: '15%', sort: 'asc' },
            {   name: 'alumno',  label: 'IDALUMNO', sortable: true,  width: '15%'  },
            {   name: 'nombre',  label: 'NOMBRE', sortable: true, width: '60%' }
        ];
        vm.tablaDocentesTH = [
            {   name: 'numero',     label: 'NÚMERO',   sortable: true, width: '15%', sort: 'asc' },
            {   name: 'docente',  label: 'IDDOCENTE', sortable: true,  width: '15%'  },
            {   name: 'nombre',  label: 'NOMBRE', sortable: true, width: '60%' }
        ];
        vm.tablaAdvosTH = [
            {   name: 'numero',     label: 'NÚMERO',   sortable: true, width: '15%', sort: 'asc' },
            {   name: 'admin',  label: 'IDEMPLEADO', sortable: true,  width: '15%'  },
            {   name: 'nombre',  label: 'NOMBRE', sortable: true, width: '60%' }
        ];

        vm.listaUsuariosThead = [
            {   name: 'numero',     label: 'NÚMERO',   sortable: true, width: '15%', sort: 'asc' },
            {   name: 'usuario',  label: 'USUARIO', sortable: true,  width: '15%'  },
            {   name: 'nombre',  label: 'NOMBRE', sortable: true, width: '60%' }
        ];

        vm.dataTableTbody = [];
        vm.rs = [];
        vm.tablaAlumnosBD = [];
        vm.tablaDocentesBD = [];
        vm.tablaAdvosBD = [];
        vm.listaUsuariosTbody = [];
        
        $scope.$on('lx-data-table__selected', updateActions);
        $scope.$on('lx-data-table__unselected', updateActions);
        $scope.$on('lx-data-table__sorted', updateSort);
        // $scope.$on('paste', pasteAlumnosb);
        ////////////

        function updateActions(_event, _dataTableId, _selectedRows) {
            switch (_dataTableId ) {  
                case 'constancias':
                    if (_event.name === 'lx-data-table__selected' && _selectedRows.length >1) {
                        LxDataTableService.unselect(_dataTableId, _selectedRows[0]);
                     }
                    vm.selectedCons = _selectedRows;
                    vm.idevento = (_selectedRows.length === 0 ? 0 : _selectedRows[0].idevento);
                    break;
                case 'alumnos':
                    vm.selectedAlumnos = _selectedRows;

                    break;
                case 'docentes':
                    vm.selectedDocentes = _selectedRows;
                    break;
                case 'advos':
                    vm.selectedAdvos = _selectedRows;
                    break;
                case 'listaUsuarios':
                    vm.selectedUsuarios = _selectedRows;

                    break;
                }
        }

        function updateSort(_event, _dataTableId, _column) {
            switch (_dataTableId ) {  
                case 'constancias':
                    vm.dataTableTbody = $filter('orderBy')(vm.dataTableTbody, _column.name, _column.sort === 'desc' ? true : false);
                        // console.log(_selectedRows);
                    break;
                case 'alumnos':
                    vm.tablaAlumnosBD = $filter('orderBy')(vm.tablaAlumnosBD, _column.name, _column.sort === 'desc' ? true : false);
                    break;
                case 'docentes':
                    vm.tablaDocentesBD = $filter('orderBy')(vm.tablaDocentesBD, _column.name, _column.sort === 'desc' ? true : false);
                    break;
                case 'advos':
                    vm.tablaAdvosBD = $filter('orderBy')(vm.tablaAdvosBD, _column.name, _column.sort === 'desc' ? true : false);
                    break;
                case 'listaUsuarios':
                    vm.listaUsuariosTbody = $filter('orderBy')(vm.listaUsuariosTbody, _column.name, _column.sort === 'desc' ? true : false);
                    break;
                }

        }

        function pasteAlumnos(_e){ // evento generado por el click +
            if ( global !== null) {
                globalAlumnos = global.replace(/\r\n|\n/g, ",");
                globalAlumnos = globalAlumnos.substr(0, globalAlumnos.length-1);
                // console.log(global);
                // console.log(globalAlumnos);
                llenarAlumnos();
            }

        }

        function cleanLista(tipo){ // evento generado por el click +
            switch (tipo) {
                case 'alumnos':
                        vm.tablaAlumnosBD = [];
                        vm.selectedAlumnos = [];
                    break;
                case 'docentes':
                        vm.tablaDocentesBD = [];
                        vm.selectedDocentes = [];
                    break;
                case 'advos':
                        vm.tablaAdvosBD = [];
                        vm.selectedAdvos = [];
                    break;

            }
        }

        function pasteDocentes(_e){ // evento generado por el click +
            if ( global !== null) {
                globalDocentes = global.replace(/\r\n|\n/g, ",");
                globalDocentes = globalDocentes.substr(0, globalDocentes.length-1);
                // console.log(globalDocentes);
                llenarDocentes();
            }
        }

        function pasteAdvos(_e){ // evento generado por el click +
            if ( global !== null) {
                globalAdvos = global.replace(/\r\n|\n/g, ",");
                globalAdvos = globalAdvos.substr(0, globalAdvos.length-1);
                // console.log(globalAdvos);
                llenarAdvos();
            }
        }

        // para ver las lista de constancias generadas
        function verListaCons(tipo){
            vm.selectedUsuarios = [];
            vm.tipo = tipo;
            vm.listaUsuariosTbody = [];
            LxDialogService.open('idlista');
            cargarUsuariosConstancia();
        
        }

        function cambiaEvento(){
            
        }

        // callback del select plantilla
        function callbackPlantilla(_newVal, _oldVal){
            vm.constancia.formato = _newVal.name;
        
        }
 
        // modifica el registro=constancia seleccionado...
        function editarConstancia() {
            // leee el constancia seleccionado
            leerConstanciaID( vm.selectedCons[0].idc );
            vm.modificaConstancia = true;
            vm.activeTab = 1;
            // console.log( "PRIMERO ", vm.constancia );   // 2do.
            llenarPlantillas();
        }

        function clonarConstancia() {
            // leee el constancia seleccionado
            leerConstanciaID( vm.selectedCons[0].idc );
            vm.clonaConstancia = true;
            vm.activeTab = 1;
            // console.log( "PRIMERO ", vm.constancia );   // 2do.
            llenarPlantillas();
        }

        function newConstancia() {
            // leee el constancia seleccionado
            cancelarDatos();
            vm.nuevaConstancia = true;
            vm.activeTab = 1;
            // console.log( "PRIMERO ", vm.constancia );   // 2do.
            llenarPlantillas();
        }

        // cancela la edición del registro=constancia seleccionado...
        function cancelarEdicionConsta() {
            vm.modificaConstancia = false;
            vm.activeTab = 0;
            // console.log( "PRIMERO ", vm.constancia );   // 2do.
            // leerconstancias();
            // LxDataTableService.select('constancias', vm.selectedCons);
            // vm.dataTableTbody[0].lxDataTableSelected = true;
            // $scope.$emit('lx-data-table__selected', 'constancias', vm.dataTableTbody[0])
            // console.log(vm.dataTableTbody);
        }

        function cancelarNuevaConsta() {
            vm.nuevaConstancia = false;
            vm.activeTab = 0;
            // console.log( "PRIMERO ", vm.constancia );   // 2do.
            // vm.selectedCons = [];
        }

        function cancelarClonConsta() {
            vm.clonaConstancia = false;
            vm.activeTab = 0;
            // console.log( "PRIMERO ", vm.constancia );   // 2do.
            // vm.selectedCons = [];
        }

        // borrar el registro=constancia seleccionado...
        function borrarConstancia() {
            vm.borraConstancia = true;
            vm.activeTab = 1;
            leerConstanciaID( vm.selectedCons[0].idc );
        }

        // Siguiente Offset de constancias...
        function siguienteOffset() {
            vm.activeTab = 0;
            if ((vm.offset+10) <= vm.tope) {
                vm.offset += 10;
            } else {
                vm.offset = vm.tope - vm.tope % 10;
            }
            leerConstancias();
            // vm.selectedCons = [];
        }

        // anterior Offset de constancias
        function anteriorOffset() {
            vm.activeTab = 0;
            if (vm.offset >= 10) {
                vm.offset -= 10;
            } else {
                vm.offset = 0;
            }
            leerConstancias();

            // vm.selectedCons = [];
        }

        // Buscar constancias por año...
        function buscarYear() {
            vm.activeTab = 0;
            vm.offset = 0;
            leerConstancias();
            // vm.selectedCons = [];
        }

        // cancelar borrar el registro=constancia seleccionada...
        function cancelarBorrarConsta() {
            vm.borraConstancia = false;
            vm.activeTab = 0;
            leerConstancias();
        }

        // subir plantilla ... boton
        function subirPlantilla() {
                vm.subePlantilla = true;
                vm.activeTab = 2;
        }

        // cancela subir plantilla ... boton
        function cierraEnvioPlantilla() {
            $timeout( function() {
                vm.activeTab = 1; // regresa a edición/nuevo/clonación...
            }, 100);
            vm.subePlantilla = false;

        }

        // callback - de envio de archivo / manejar el archivo...
        function manejaArchivo( _newFile ) {

            if ( !(_newFile.type === "image/jpeg" )) {
                vm.archivo = null;
                _newFile = null;
                $('div#msgError').html('<b>Error:</b><br>' + 'Sólo son válidos archivos en formato jpg/jpeg...');
                LxDialogService.open('dlgError');
                // LxNotificationService.error('Sólo son válidos archivos en formato jpg/jpeg...');
            } else {
                vm.archivo = _newFile;
                vm.constancia.formato = _newFile.name;
                // verificar si el archivo existe...
                yaExistePlantilla();

            }
        }

        function borrarAsistencia(){ // de reg_eventos y si esta generada de reg_constancias
            var usuarios = "";
            var x = 0;
            vm.selectedUsuarios.forEach(function (el) {
                usuarios += el.usuario + ",";
                // LxDataTableService.unselect('listaUsuarios', el);
                x = vm.listaUsuariosTbody.map( function (e) { return e.usuario;}).indexOf(el.usuario);
                vm.listaUsuariosTbody[x].lxDataTableDisabled = true;
            });
            usuarios = usuarios.substr(0, usuarios.length-1);
            // console.log(usuarios);
            // return;
            var datosEnviar = { "evento": vm.idevento, "accion" : 'borrarAsistencias', "tipo" : vm.tipo, "usuarios" : usuarios  };

            $http({
                method: 'POST',
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/borrar_asistencias_admin.php'
            })
            .then( function ok(resp) {
                var rs = resp.data;
                // console.log(resp);
                if (rs.status == 'Ok' ) {
                    $('div#msgInfo').html(rs.data);
                    LxDialogService.open('dlgInfo');
                } else {
                    // rs = resp;
                    $('div#msgError').html('<b>Error:</b><br>' + rs.error);
                    LxDialogService.open('dlgError');
                    // console.log( rs.numeros );
                       
                }
            }, function error(resp) {
                $('div#msgError').html('<b>Error:</b><br>' + resp);
                LxDialogService.open('dlgError');
                // console.log(resp);
            });

            
        }

        function yaExistePlantilla(){
            var datosEnviar = { "file" : vm.constancia.formato };

            $http({
                method: 'POST',
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/utils/findfile.php'
            })
            .then( function ok(resp) {
                var rs = resp.data;
                if (rs.found ) {
                    $('div#msgError').html('<b>Error:</b><br>' + 'Ya existe la plantilla ' + vm.constancia.formato + ' en el sistema');
                    LxDialogService.open('dlgError');
                }
            }, function error(resp) {
                rs = resp;
                $('div#msgError').html('<b>Error:</b><br>' + resp.data);
                LxDialogService.open('dlgError');
            });

        }

        // llenar el select con las plantillas disponibles...
        function llenarPlantillas(){
            var datosEnviar = { "accion" : 'listarPlantillas' };

            $http({
                method: 'POST',
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/listar.plantillas_admin.php'
            })
            .then( function ok(resp) {
                var rs = resp.data;
                // console.log(resp);
                if (rs.status == 'Ok' ) {
                    vm.selectPlantilla = rs.plantillas;
                    vm.constancia.plantilla = {"name": vm.constancia.formato};
                }
            }, function error(resp) {
                rs = resp;
                $('div#msgError').html('<b>Error:</b><br>' + resp.data);
                LxDialogService.open('dlgError');
            });

        }

        // llenar la tabla de usuarios tipo con la constancias idevento...
        function cargarUsuariosConstancia(){
            var datosEnviar = { "evento" : vm.idevento, "accion" : 'llenarUsuarios', "tipo" : vm.tipo};

            vm.showLinearProgress = true;       // progress...
            vm.enviado = true;

            $http({
                method: 'POST',
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/cargar_usuarioscons_admin.php'
            })
            .then( function ok(resp) {
                var rs = resp.data;
                vm.showLinearProgress = false;       // progress...
                vm.enviado = false;
    
                if (rs.status == 'Ok' ) {
                    vm.listaUsuariosTbody = rs.usuarios;
                    // console.log( rs );
                } else {
                    // rs = resp;
                    $('div#msgError').html('<b>Error:</b><br>' + rs.error);
                    LxDialogService.open('dlgError');
                    // console.log( rs );
                       
                }
            }, function error(resp) {
                // var rs = resp;
                $('div#msgError').html('<b>Error:</b><br>' + resp.data);
                LxDialogService.open('dlgError');
                vm.showLinearProgress = false;       // progress...
                vm.enviado = false;
            });

        }

        // llenar la tabla de alumnos con los números pegados ctrl+v...
        function llenarAlumnos(){
            var datosEnviar = { "cuentas" : globalAlumnos, "accion" : 'llenarUsuarios', "tipo" : 'alumnos'};

            $http({
                method: 'POST',
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/llenar_usuarios_admin.php'
            })
            .then( function ok(resp) {
                var rs = resp.data;
                // console.log(resp);
                if (rs.status == 'Ok' ) {
                    vm.tablaAlumnosBD = rs.alumnos;
                    // console.log( rs );
                } else {
                    // rs = resp;
                    $('div#msgError').html('<b>Error:</b><br>' + rs.error);
                    LxDialogService.open('dlgError');
                    // console.log( rs );
                       
                }
            }, function error(resp) {
                // var rs = resp;
                $('div#msgError').html('<b>Error:</b><br>' + resp.data);
                LxDialogService.open('dlgError');
            });

        }

        // llenar la tabla de docentes con los números pegados ctrl+v...
        function llenarDocentes(){
            var datosEnviar = { "cuentas" : globalDocentes, "accion" : 'llenarUsuarios', "tipo" : 'docentes'};

            $http({
                method: 'POST',
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/llenar_usuarios_admin.php'
            })
            .then( function ok(resp) {
                var rs = resp.data;
                // console.log(resp);
                if (rs.status == 'Ok' ) {
                    vm.tablaDocentesBD = rs.docentes;
                    // console.log( rs.numeros );
                } else {
                    // rs = resp;
                    $('div#msgError').html('<b>Error:</b><br>' + rs.error);
                    LxDialogService.open('dlgError');
                    // console.log( rs.numeros );
                       
                }
            }, function error(resp) {
                // var rs = resp;
                $('div#msgError').html('<b>Error:</b><br>' + resp.data);
                LxDialogService.open('dlgError');
            });

        }

        // llenar la tabla de Administrativos con los números pegados ctrl+v...
        function llenarAdvos(){
            var datosEnviar = { "cuentas" : globalAdvos, "accion" : 'llenarUsuarios', "tipo" : 'advos'};

            $http({
                method: 'POST',
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/llenar_usuarios_admin.php'
            })
            .then( function ok(resp) {
                var rs = resp.data;
                // console.log(resp);
                if (rs.status == 'Ok' ) {
                    vm.tablaAdvosBD = rs.advos;
                    // console.log( rs.numeros );
                } else {
                    // rs = resp;
                    $('div#msgError').html('<b>Error:</b><br>' + rs.error);
                    LxDialogService.open('dlgError');
                    // console.log( rs.numeros );
                       
                }
            }, function error(resp) {
                // var rs = resp;
                $('div#msgError').html('<b>Error:</b><br>' + resp.data);
                LxDialogService.open('dlgError');
            });

        }

        function genAlumnosCons(){
            // crear una cadena separada por comas del arreglo de alumnos Seleccionados...vm.selectedAlumnos
            var numeros = "";
            vm.selectedAlumnos.forEach(function (el) {
                numeros += el.alumno + ",";
            });
            numeros = numeros.substr(0, numeros.length-1);
            // console.log(numeros);
            
            var datosEnviar = { "numeros" : numeros, "evento": vm.idevento, "accion" : 'generarConstancias', "tipo" : 'alumnos' };

            $http({
                method: 'POST',
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/generar_constancias_admin.php'
            })
            .then( function ok(resp) {
                var rs = resp.data;
                // console.log(resp);
                if (rs.status == 'Ok' ) {
                    $('div#msgInfo').html(rs.data);
                    LxDialogService.open('dlgInfo');
                } else {
                    // rs = resp;
                    $('div#msgError').html('<b>Error:</b><br>' + rs.error);
                    LxDialogService.open('dlgError');
                    // console.log( rs.numeros );
                       
                }
            }, function error(resp) {
                $('div#msgError').html('<b>Error:</b><br>' + resp);
                LxDialogService.open('dlgError');
                // console.log(resp);
            });

        }

        function genDocentesCons(){
            // crear una cadena separada por comas del arreglo de docentes Seleccionados...vm.selectedDocentes
            var numeros = "";
            vm.selectedDocentes.forEach(function (el) {
                numeros += el.docente + ",";
            });
            numeros = numeros.substr(0, numeros.length-1);
            // console.log(numeros);
            
            var datosEnviar = { "numeros" : numeros, "evento": vm.idevento, "accion" : 'generarConstancias', "tipo" : 'docentes' };

            $http({
                method: 'POST',
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/generar_constancias_admin.php'
            })
            .then( function ok(resp) {
                var rs = resp.data;
                // console.log(resp);
                if (rs.status == 'Ok' ) {
                    $('div#msgInfo').html(rs.data);
                    LxDialogService.open('dlgInfo');
                } else {
                    // rs = resp;
                    $('div#msgError').html('<b>Error:</b><br>' + rs.error);
                    LxDialogService.open('dlgError');
                    // console.log( rs.numeros );
                       
                }
            }, function error(resp) {
                $('div#msgError').html('<b>Error:</b><br>' + resp);
                LxDialogService.open('dlgError');
                // console.log(resp);
            });

        }

        function genAdvosCons(){
            // crear una cadena separada por comas del arreglo de docentes Seleccionados...vm.selectedDocentes
            var numeros = "";
            vm.selectedAdvos.forEach(function (el) {
                numeros += el.admin + ",";
            });
            numeros = numeros.substr(0, numeros.length-1);
            // console.log(numeros);
            
            var datosEnviar = { "numeros": numeros, "evento": vm.idevento, "accion" : 'generarConstancias', "tipo" : 'advos' };

            $http({
                method: 'POST',
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/generar_constancias_admin.php'
            })
            .then( function ok(resp) {
                var rs = resp.data;
                // console.log(resp);
                if (rs.status == 'Ok' ) {
                    $('div#msgInfo').html(rs.data);
                    LxDialogService.open('dlgInfo');
                } else {
                    // rs = resp;
                    $('div#msgError').html('<b>Error:</b><br>' + rs.error);
                    LxDialogService.open('dlgError');
                    // console.log( rs.numeros );
                       
                }
            }, function error(resp) {
                $('div#msgError').html('<b>Error:</b><br>' + resp);
                LxDialogService.open('dlgError');
                console.log(resp);
            });

        }

        // llenar Alumnos a la tabla de alumnos para generar las CONSTANCIAS...
        function enviaPlantilla(){
            if (vm.archivo !== null) {
                var datos = new FormData();
                datos.append('file', vm.archivo );
                datos.append('plantilla', vm.constancia.formato );
                datos.append('registrar', 'uploadFile' );

                $.ajax({
                    async: true,
                    cache: false,
                    type: "POST",
                    timeout: 90000,
                    url: "/siiFCA/api/guarda.plantilla_admin.php",
                    dataType: "html",
                    processData: false,
                    contentType: false,
                    data: datos,
                    beforeSend: function( resp ) {
                        //console.log(datosEnviar);
                        vm.showCircularProgress = true;       // progress...
                        vm.enviado = true;
                        //console.log(datosEnviar);
                    }
                })
                .done(function( resp ) {
                    //console.log(resp);
                    var rs = JSON.parse(resp);
                    vm.showCircularProgress = false;
                    vm.enviado = false;
                    // console.log(resp);
                    if (rs.status == 'Ok') {
                        $('div#msgInfo').html(rs.data);
                        LxDialogService.open('dlgInfo');
                        llenarPlantillas();
                    } else {
                        $('div#msgError').html(rs.status + ':<br>' + rs.error);
                        LxDialogService.open('dlgError');
                     }
                })
                .fail(function( jqXHR, resp ) {
                    var rs = JSON.parse(resp);
                    vm.showCircularProgress = false;
                    vm.enviado = false;
                    $('div#msgError').html('<b>' + rs.status + '</b><br>' + rs.data);
                    LxDialogService.open('dlgError');
                });

            } else {
                $('div#msgError').html('<b>Error:</b><br>' + 'Debe indicar la plantilla correcta en formato JPG...');
                LxDialogService.open('dlgError');
            }

        }

        function leerConstancias() { 
            // validar los datos antes de ser enviados...
                
            var datosEnviar = { "offset" : vm.offset, "year" : vm.year, "registrar"  : "leerConstancias" };
            // console.log(datosEnviar.recaptcha_response);
            vm.showLinearProgress = true;       // progress...
            vm.enviado = true;

            $http({
                method: 'POST',
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/leer_constancias_admin.php'
            })
            .then( function ok(resp) {
                vm.showLinearProgress = false;
                vm.enviado = false;
                vm.rs = resp.data;
                //vm.formaActiva = true;
                if (resp.status === 200 && vm.rs.status === 'Ok') {
                    vm.dataTableTbody = vm.rs.constancias;
                    vm.tope = parseInt(vm.rs.tope);
                    vm.selectedCons = [];
                    vm.selectedCons.length = 0 ;
                    // vm.constancias = r.constancias;
                    vm.hayConstancias = true;
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

        // llena el arreglo vm.constancias a partir de un id (idconstancia)
        function leerConstanciaID(idc) { 
            // validar los datos antes de ser enviados...
                
            var datosEnviar = { "idc": idc, "registrar"  : "leerConstanciaxID" };
            
            vm.showLinearProgress = true;       // progress...
            vm.enviado = true;

            $http({
                method: 'POST',
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/leer_constancia_id_admin.php'
            })
            .then( function ok(resp) {
                vm.showLinearProgress = false;
                vm.enviado = false;
                var r = resp.data;
                //vm.formaActiva = true;
                if (resp.status === 200 && r.status === 'Ok') {
                    vm.constancia = r.constancia;
                    vm.constancia.idc  = parseInt(vm.constancia.idc);
                    vm.constancia.evento = parseInt(vm.constancia.evento);
                    vm.constancia.plantilla = { "name" : vm.constancia.formato };
                    vm.constancia.cfirmas = parseInt(vm.constancia.cfirmas);
                    vm.constancia.status = vm.selectStatus[parseInt(vm.constancia.status)];
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

        function guardarEdicionConsta() { 
            // validar los datos antes de ser enviados...
                
            var datosEnviar = {       "idc" : vm.constancia.idc,
                                   "evento" : vm.constancia.evento,
                                  "formato" : vm.constancia.formato,
                              "institucion" : vm.constancia.institucion,
                                 "facultad" : vm.constancia.facultad,
                             "departamento" : vm.constancia.departamento,
                                   "otorga" : vm.constancia.otorga,
                                     "tipo" : vm.constancia.tipo,
                                    "texto" : vm.constancia.texto,
                               "curricular" : (vm.constancia.curricular ? 1 : 0),
                                  "cfirmas" : vm.constancia.cfirmas,
                              "lugar_fecha" : vm.constancia.lugar_fecha,
                                  "nombre1" : vm.constancia.nombre1,
                                  "puesto1" : vm.constancia.puesto1,
                                  "nombre2" : vm.constancia.nombre2,
                                  "puesto2" : vm.constancia.puesto2,
                                  "nombre3" : vm.constancia.nombre3,
                                  "puesto3" : vm.constancia.puesto3,
                                "diciembre" : vm.constancia.diciembre,
                                    "santa" : vm.constancia.santa,
                                  "verano"  : vm.constancia.verano,
                                    "ciclo" : vm.constancia.ciclo === null ? 0 : vm.constancia.ciclo,
                                     "lema" : vm.constancia.lema,
                                    "fecha" : vm.constancia.fecha,
                                   "status" : vm.constancia.status.id,
                                "registrar" : "guardarConstancia",
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
                url: '/siiFCA/api/guarda_constancia_admin.php'
            })
            .then( function ok(resp) {
                vm.showLinearProgress = false;
                vm.enviado = false;
                var r = resp.data;
                //vm.formaActiva = true;
                if (resp.status === 200 && r.status === 'Ok') {
                    $('div#msgInfo').html(r.data);
                    LxDialogService.open('dlgInfo');
                    // volver a leer los constancias por los cambios guardados...
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

        function guardarNuevaConsta() { 
            // validar los datos antes de ser enviados...
                
            var datosEnviar = {       "idc" : vm.constancia.idc,
                                   "evento" : vm.constancia.evento,
                                  "formato" : vm.constancia.formato,
                              "institucion" : vm.constancia.institucion,
                                 "facultad" : vm.constancia.facultad,
                             "departamento" : vm.constancia.departamento,
                                   "otorga" : vm.constancia.otorga,
                                     "tipo" : vm.constancia.tipo,
                                    "texto" : vm.constancia.texto,
                               "curricular" : (vm.constancia.curricular ? 1 : 0 ),
                                  "cfirmas" : vm.constancia.cfirmas,
                              "lugar_fecha" : vm.constancia.lugar_fecha,
                                  "nombre1" : vm.constancia.nombre1,
                                  "puesto1" : vm.constancia.puesto1,
                                  "nombre2" : vm.constancia.nombre2,
                                  "puesto2" : vm.constancia.puesto2,
                                  "nombre3" : vm.constancia.nombre3,
                                  "puesto3" : vm.constancia.puesto3,
                                "diciembre" : vm.constancia.diciembre,
                                    "santa" : vm.constancia.santa,
                                  "verano"  : vm.constancia.verano,
                                    "ciclo" : vm.constancia.ciclo,
                                     "lema" : vm.constancia.lema,
                                    "fecha" : vm.constancia.fecha,
                                   "status" : vm.constancia.status.id,
                                "registrar" : "guardarConstancia",
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
                url: '/siiFCA/api/guarda_constancia_admin.php'
            })
            .then( function ok(resp) {
                vm.showLinearProgress = false;
                vm.enviado = false;
                var r = resp.data;
                //vm.formaActiva = true;
                if (resp.status === 200 && r.status === 'Ok') {
                    $('div#msgInfo').html(r.data);
                    LxDialogService.open('dlgInfo');
                    // volver a leer los constancias por los cambios guardados...
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

        function guardarClonConsta() { 
            // validar los datos antes de ser enviados...
                
            var datosEnviar = {       "idc" : vm.constancia.idc,
                                   "evento" : vm.constancia.evento,
                                  "formato" : vm.constancia.formato,
                              "institucion" : vm.constancia.institucion,
                                 "facultad" : vm.constancia.facultad,
                             "departamento" : vm.constancia.departamento,
                                   "otorga" : vm.constancia.otorga,
                                     "tipo" : vm.constancia.tipo,
                                    "texto" : vm.constancia.texto,
                               "curricular" : (vm.constancia.curricular ? 1 : 0 ),
                                  "cfirmas" : vm.constancia.cfirmas,
                              "lugar_fecha" : vm.constancia.lugar_fecha,
                                  "nombre1" : vm.constancia.nombre1,
                                  "puesto1" : vm.constancia.puesto1,
                                  "nombre2" : vm.constancia.nombre2,
                                  "puesto2" : vm.constancia.puesto2,
                                  "nombre3" : vm.constancia.nombre3,
                                  "puesto3" : vm.constancia.puesto3,
                                "diciembre" : vm.constancia.diciembre,
                                    "santa" : vm.constancia.santa,
                                  "verano"  : vm.constancia.verano,
                                    "ciclo" : vm.constancia.ciclo,
                                     "lema" : vm.constancia.lema,
                                    "fecha" : vm.constancia.fecha,
                                   "status" : vm.constancia.status.id,
                                "registrar" : "guardarConstancia",
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
                url: '/siiFCA/api/guarda_constancia_admin.php'
            })
            .then( function ok(resp) {
                vm.showLinearProgress = false;
                vm.enviado = false;
                var r = resp.data;
                //vm.formaActiva = true;
                if (resp.status === 200 && r.status === 'Ok') {
                    $('div#msgInfo').html(r.data);
                    LxDialogService.open('dlgInfo');
                    // volver a leer los constancias por los cambios guardados...
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

        function guardarBorrarConsta() { 
            // validar los datos antes de ser enviados...
                
            var datosEnviar = {       "idc" : vm.constancia.idc,
                                   "evento" : vm.constancia.evento,
                                "registrar" : "guardarConstancia",
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
                url: '/siiFCA/api/guarda_constancia_admin.php'
            })
            .then( function ok(resp) {
                vm.showLinearProgress = false;
                vm.enviado = false;
                var r = resp.data;
                //vm.formaActiva = true;
                if (resp.status === 200 && r.status === 'Ok') {
                    $('div#msgInfo').html(r.data);
                    LxDialogService.open('dlgInfo');
                    // actualizar el TableBody..
                    // volver a leer los constancias por los cambios guardados...
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
            vm.constancia =  {
                idc: 0,
                evento: 0,
                formato: "formato_constancia.jpg",
                plantilla: {"name" : "formato_constancia.jpg" },
                institucion: "Universidad Autónoma de Sinaloa",
                facultad: "Facultad de Contaduría y Administración",
                departamento: "",
                otorga: "Otorgan la presente",
                tipo: "Constancia",
                texto: "<p>Por su participación como <b>ORGANIZADOR</b> en el evento...</p>",
                curricular: true,
                cfirmas: 2,
                lugar_fecha: "Culiacán Rosales, Sinaloa, a ...",
                nombre1: "MC. VÍCTOR MANUEL MIZQUIZ REYES",
                puesto1: "Director",
                nombre2: "DRA. NADIA AILEEN VALDEZ ACOSTA",
                puesto2: "Secretaria Académica",
                nombre3: "",
                puesto3: "",
                diciembre: "",
                santa: "",
                verano: "",
                ciclo: 11,
                lema: "Sursum Versus",
                fecha: "",
                status: vm.selectStatus[1]
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
var global = null;
var globalAlumnos ='84655992';
var globalDocentes = '8698';
var globalAdvos = '8699';

document.addEventListener('paste', function(e) {
    standardClipboardEvent('paste', e);
    e.preventDefault();
});

// For every broswer except IE, we can easily get and set data on the clipboard
var standardClipboardEvent = function(clipboardEvent, event) {
    // event.stopImmediatePropagation();
    var clipboardData = event.clipboardData;
    
    global = clipboardData.getData('text/plain');
    // console.log(clipboardData.getData('text/plain'));
    // console.log('Clipboard HTML: ' + clipboardData.getData('text/html'));

};
