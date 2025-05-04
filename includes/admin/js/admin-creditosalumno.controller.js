(function() {
    'use strict';

    angular.module('Controllers')
        .controller('adminUserCreditosAlumnoController', adminUserCreditosAlumnoController);

    adminUserCreditosAlumnoController.$injet = ['LxDialogService', '$http', '$httpParamSerializerJQLike', 'LxDataTableService',
                                        'SessionService', '$scope', '$filter'];

    function adminUserCreditosAlumnoController(LxDialogService, $http, $httpParamSerializerJQLike, LxDataTableService,
                                        SessionService, $scope, $filter) {
        var vm = this;
        vm.showLinearProgress = false;
        vm.enviado = false;
        vm.formaActiva = true;
        vm.hayDatos = false;
        vm.userValidado = SessionService.sessionUser();
        vm.permisos = JSON.parse(SessionService.sessionPermisos());
        vm.enviarConsulta = enviarConsulta;
        vm.verConstancia = verConstancia;
        vm.cancelarDatos = cancelarDatos;
        vm.cancelMouseover = cancelMouseover;
        //vm.scrollDown = scrollDown;

        vm.campos = {
            cuenta: '',
            pdf: '/siiFCA/images/nopdf.pdf'
        };

        vm.dataTableThead = [
            {   name: 'nombre', label: 'NOMBRE', sortable: true,  width: '40%'},
            {   name: 'carrera', label: 'CARRERA', sortable: true,  width: '8%'},
            {   name: 'turno', label: 'TURNO', sortable: true,  width: '12%'},
            {   name: 'grupo', label: 'GRUPO', sortable: true,  width: '8%'},
            {   name: 'acad',  label: 'ACAD', sortable: true, width: '8%' },
            {   name: 'cult',  label: 'CULT', sortable: true, width: '8%' },
            {   name: 'dep',   label: 'DEP',    sortable: true, width: '8%' },
            {   name: 'total', label: 'TOTAL',  sortable: true, width: '8%',
                format: function(r) {return (r.total >=48 ? '<b>'+r.total+'</b> <i class="mdi mdi-check-bold tc-green-800"></i>': ''+r.total )} }
        ];

        vm.dataTableTbody = [];
        
        $scope.$on('lx-data-table__selected', updateActions);
        $scope.$on('lx-data-table__unselected', updateActions);
        $scope.$on('lx-data-table__sorted', updateSort);

        $scope.$watch('vm.campos.cuenta', function(newValue, oldValue) {
            if (vm.campos.cuenta == undefined || newValue.length < 8 || (newValue.length===8 && newValue !== oldValue)) {
                vm.campos.pdf = '/siiFCA/images/nopdf.pdf';
                vm.dataTableTbody = [];
            }
        });

        function updateActions(_event, _dataTableId, _selectedRows) {
            if (_dataTableId === 'creditos') {
                if (_event.name === 'lx-data-table__selected' && _selectedRows.length >1) {
                    LxDataTableService.unselect(_dataTableId, _selectedRows[0]);
                 }
            vm.selectedCons = _selectedRows;
            }
        }

        function updateSort(_event, _dataTableId, _column) {
            if (_dataTableId === 'creditos') {
                vm.dataTableTbody = $filter('orderBy')(vm.dataTableTbody, _column.name, _column.sort === 'desc' ? true : false);
            }
        }

        // consulta de Créditos X Alumno con el número de Cuenta....
        function enviarConsulta() {
            // revisar los parametros antes de enviar...
            var noError = true;
            var errorText = "Error: <br>";

            if (vm.campos.cuenta === undefined || vm.campos.cuenta.length < 8) {
                noError = false;
                errorText = errorText + "Debe indicar un Número de Cuenta válido<br>";
            }            

            if (noError) {
                creditosxAlumno();
            } else {
                $('div#msgError').html(errorText);
                LxDialogService.open('dlgError');
            }

        }

        function creditosxAlumno() { 
            // validar los datos antes de ser enviados...
                
            var datosEnviar = { "cuenta": vm.campos.cuenta,  
                                "accion": "verCreditosAlumno"
            };

            vm.showLinearProgress = true;       // progress...
            vm.enviado = true;

            $http({
                method: 'POST',
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/consulta_creditosalumno_admin.php'
            })
            .then( function ok(resp) {
                vm.showLinearProgress = false;
                vm.enviado = false;
                var r = resp.data;
                //vm.formaActiva = true;
                if (resp.status === 200 && r.status === 'Ok') {
                    vm.dataTableTbody = r.tabla;
                    // vm.dataTableTfoot = r.sumas;
                    // console.log(r.tabla);
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

        function verConstancia() {
            // revisar los parametros antes de enviar...
            var noError = true;
            var errorText = "Error: <br>";

            if (vm.campos.cuenta === undefined || vm.campos.cuenta.length < 8) {
                noError = false;
                errorText = errorText + "Debe indicar un Número de Cuenta válido<br>";
            }            

            if (noError) {
                // vm.campos.pdf = '/siiFCA/images/nopdf.pdf';
                verConstanciaCreditos();
            } else {
                $('div#msgError').html(errorText);
                LxDialogService.open('dlgError');
            }

        }

        function verConstanciaCreditos() { 
            // validar los datos antes de ser enviados...
                
            var datosEnviar = { "cuenta": vm.campos.cuenta,  
                                "accion": "verConstanciaAlumno"
            };

            vm.showLinearProgress = true;       // progress...
            vm.enviado = true;

            $http({
                method: 'POST',
                timeout: 50000,
                data: $httpParamSerializerJQLike(datosEnviar),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded','Data-Type': 'html' },
                url: '/siiFCA/api/ver_constanciacreditos_admin.php'
            })
            .then( function ok(resp) {
                vm.showLinearProgress = false;
                vm.enviado = false;
                var r = resp.data;
                //vm.formaActiva = true;
                if (resp.status === 200 && r.status === 'Ok') {
                    // vm.campos.pdf = '';
                    vm.campos.pdf = r.pdf;
                    // vm.dataTableTfoot = r.sumas;
                    // console.log(r.tabla);
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
                $('div#msgError').html('<b>Error:</b><br>' + resp.error);
                //vm.htmlmsg = resp.data;
                LxDialogService.open('dlgError');
            });
        
        }


        // cencelar datos de edición
        function cancelarDatos() {
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

    }

})();
angular.module("lumx.data-table").run(['$templateCache', function(a) { a.put('data-table.html', '<div class="data-table-container">\n' +
    '    <table class="data-table"\n' +
    '           ng-class="{ \'data-table--bulk\': lxDataTable.bulk,\n' +
    '                       \'data-table--border\': lxDataTable.border,\n' +
    '                       \'data-table--thumbnail\': lxDataTable.thumbnail }">\n' +
    '        <thead>\n' +
    '            <tr ng-class="{ \'data-table__selectable-row\': lxDataTable.selectable,\n' +
    '                            \'data-table__selectable-row--is-selected\': lxDataTable.selectable && lxDataTable.allRowsSelected, }">\n' +
    '                <th align="center" ng-if="lxDataTable.thumbnail">\n' +
    '                    <lx-button class="data-table__checkbox"\n' +
    '                               lx-type="icon" lx-color="{{ lxDataTable.allRowsSelected ? \'accent\' : \'grey\' }}"\n' +
    '                               ng-click="lxDataTable.toggleAllSelected()"\n' +
    '                               ng-if="lxDataTable.selectable">\n' +
    '                        <lx-icon lx-id="checkbox-blank-outline" ng-if="!lxDataTable.allRowsSelected"></lx-icon>\n' +
    '                        <lx-icon lx-id="checkbox-marked" ng-if="lxDataTable.allRowsSelected"></lx-icon>\n' +
    '                    </lx-button>\n' +
    '                </th>\n' +
    '                <th align="center" ng-if="lxDataTable.selectable && !lxDataTable.thumbnail">\n' +
    '                    <lx-button class="data-table__checkbox"\n' +
    '                               lx-type="icon" lx-color="{{ lxDataTable.allRowsSelected ? \'accent\' : \'grey\' }}"\n' +
    '                               ng-click="lxDataTable.toggleAllSelected()">\n' +
    '                        <lx-icon lx-id="checkbox-blank-outline" ng-if="!lxDataTable.allRowsSelected"></lx-icon>\n' +
    '                        <lx-icon lx-id="checkbox-marked" ng-if="lxDataTable.allRowsSelected"></lx-icon>\n' +
    '                    </lx-button>\n' +
    '                </th>\n' +
    '                <th align="left"\n' +
    '                    ng-class=" { \'data-table__sortable-cell\': th.sortable,\n' +
    '                                 \'data-table__sortable-cell--asc\': th.sortable && th.sort === \'asc\',\n' +
    '                                 \'data-table__sortable-cell--desc\': th.sortable && th.sort === \'desc\' }"\n' +
    '                    ng-click="lxDataTable.sort(th)"\n' +
    '                    ng-repeat="th in lxDataTable.thead track by $index"\n' +
    '                    ng-if="!lxDataTable.thumbnail || (lxDataTable.thumbnail && $index != 0)" style="width: {{ th.width }};">\n' +
    '                    <lx-icon lx-id="{{ th.icon }}" ng-if="th.icon"></lx-icon>\n' +
    '                    <span>{{ th.label }}</span>\n' +
    '                </th>\n' +
    '            </tr>\n' +
    '        </thead>\n' +
    '\n' +
    '        <tbody>\n' +
    '            <tr ng-class="{ \'data-table__selectable-row\': lxDataTable.selectable,\n' +
    '                            \'data-table__selectable-row--is-disabled\': lxDataTable.selectable && tr.lxDataTableDisabled,\n' +
    '                            \'data-table__selectable-row--is-selected\': lxDataTable.selectable && tr.lxDataTableSelected,\n' +
    '                            \'data-table__activable-row\': lxDataTable.activable,\n' +
    '                            \'data-table__activable-row--is-activated\': lxDataTable.activable && tr.lxDataTableActivated }"\n' +
    '                ng-repeat="tr in lxDataTable.tbody"\n' +
    '                ng-click="lxDataTable.toggleActivation(tr)">\n' +
    '                <td align="center" ng-if="lxDataTable.thumbnail">\n' +
    '                    <div class="data-table__thumbnail" ng-if="lxDataTable.thead[0].format" ng-bind-html="lxDataTable.$sce.trustAsHtml(lxDataTable.thead[0].format(tr))"></div>\n' +
    '\n' +
    '                    <lx-button class="data-table__checkbox"\n' +
    '                               lx-type="icon" lx-color="{{ tr.lxDataTableSelected ? \'accent\' : \'black\' }}"\n' +
    '                               ng-click="lxDataTable.toggleSelection(tr, undefined, $event)"\n' +
    '                               ng-if="lxDataTable.selectable && !tr.lxDataTableDisabled">\n' +
    '                        <lx-icon lx-id="checkbox-blank-outline" ng-if="!tr.lxDataTableSelected"></lx-icon>\n' +
    '                        <lx-icon lx-id="checkbox-marked" ng-if="tr.lxDataTableSelected"></lx-icon>\n' +
    '                    </lx-button>\n' +
    '                </td>\n' +
    '                <td align="center" ng-if="lxDataTable.selectable && !lxDataTable.thumbnail">\n' +
    '                    <lx-button class="data-table__checkbox"\n' +
    '                               lx-type="icon" lx-color="{{ tr.lxDataTableSelected ? \'accent\' : \'black\' }}"\n' +
    '                               ng-click="lxDataTable.toggleSelection(tr, undefined, $event)"\n' +
    '                               ng-disabled="tr.lxDataTableDisabled">\n' +
    '                        <lx-icon lx-id="checkbox-blank-outline" ng-if="!tr.lxDataTableSelected"></lx-icon>\n' +
    '                        <lx-icon lx-id="checkbox-marked" ng-if="tr.lxDataTableSelected"></lx-icon>\n' +
    '                    </lx-button>\n' +
    '                </td>\n' +
    '                <td align="left"\n' +
    '                    ng-repeat="th in lxDataTable.thead track by $index"\n' +
    '                    ng-if="!lxDataTable.thumbnail || (lxDataTable.thumbnail && $index != 0)">\n' +
    '                    <span ng-if="!th.format">{{ tr[th.name] }}</span>\n' +
    '                    <div ng-if="th.format" ng-bind-html="lxDataTable.$sce.trustAsHtml(th.format(tr))"></div>\n' +
    '                </td>\n' +
    '            </tr>\n' +
    '        </tbody>\n' +
    '        <tfoot>\n' +
    '            <tr ng-repeat="tr in lxDataTable.tfoot">\n' +
    '                <td ng-if="lxDataTable.thumbnail"></td>\n' +
    '                <td ng-click="lxDataTable.toggleAllSelected()"\n' +
    '                    ng-if="lxDataTable.selectable"></td>\n' +
    '                <td ng-repeat="tf in lxDataTable.thead track by $index"\n' +
    '                    ng-if="!lxDataTable.thumbnail || (lxDataTable.thumbnail && $index != 0)">\n' +
    '                    <span ng-if="!tf.format">{{ tr[tf.name] }}</span>\n' +
    '                    <div ng-if="tf.format" ng-bind-html="lxDataTable.$sce.trustAsHtml(tf.format(tr))"></div>\n' +
    '                </td>\n' +
    '            </tr>\n' +
    '        </tfoot>\n' +
    '    </table>\n' +
    '</div>');
}]);

Array.prototype.SumaCreditos = function (prop) {
    var total = 0
    for ( var i = 0, _len = this.length; i < _len; i++ ) {
        total += this[i][prop]
    }
    return total
} // console.log(vm.dataTableTbody.SumaCreditos('acad'));
