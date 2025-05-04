(function() {
    'use strict';
    
    angular
        .module('siifca', [
            'lumx',
            'ui.router',
            'Controllers',
            'Directives',
            'Services'
        ])
        .config(function($locationProvider, $stateProvider)
        {
            $locationProvider.html5Mode(
            {
                enabled: true,
                requireBase: false
            });

            $stateProvider
                .state('app',
                {
                    abstract: true,
                    views:
                    {
                        'header':
                        {
                            templateUrl: '/siiFCA/includes/layout/header/header.html'
                        },
                        'dialog':
                        {
                            templateUrl: '/siiFCA/includes/layout/dialog/dialog.html'
                        }
                    }
                })
                .state('app.home',
                {
                    url: '/siiFCA/',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/siiFCA/includes/home/home.html'
                        }
                    }
                })
                .state('app.alumnos',
                {
                    url: '/siiFCA/alumnos',
                    views:
                    {
                        'sidebar@':
                        {
                            templateUrl: '/siiFCA/includes/layout/sub-nav/sub-nav-alumnos.html'
                        }
                    },
                    redirectTo: 'app.alumnos.inicio'
                })
                .state('app.alumnos.inicio',
                {
                    url: '/inicio',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/siiFCA/includes/alumnos/inicio.html',
                            controller: 'alumnosLoginController',
                            controllerAs: 'vm'                            
                        }
                    }
                })
                .state('app.alumnos.avisos',
                {
                    url: '/avisos',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/siiFCA/includes/alumnos/avisos.html',
                            controller: 'alumnosAvisosController',
                            controllerAs: 'vm'                            
                        }
                    }
                })
                .state('app.alumnos.eventos',
                {
                    url: '/eventos',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/siiFCA/includes/alumnos/eventos.html',
                            controller: 'alumnosEventosController',
                            controllerAs: 'vm'                            
                        }
                    }
                })
                .state('app.alumnos.creditos',
                {
                    url: '/creditos',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/siiFCA/includes/alumnos/creditos.html',
                            controller: 'alumnosCreditosController',
                            controllerAs: 'vm'                            
                        }
                    }
                })
                .state('app.alumnos.constancias',
                {
                    url: '/constancias',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/siiFCA/includes/alumnos/constancias.html',
                            controller: 'alumnosConstanciasController',
                            controllerAs: 'vm'                            
                        }
                    }
                })
                .state('app.alumnos.expediente',
                {
                    url: '/expediente',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/siiFCA/includes/alumnos/expediente.html',
                            controller: 'alumnosExpedienteController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('app.alumnos.encuestas',
                {
                    url: '/encuestas',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/siiFCA/includes/alumnos/encuestas.html',
                            controller: 'alumnosEncuestasController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('app.docentes',
                {
                    url: '/siiFCA/docentes',
                    views:
                    {
                        'sidebar@':
                        {
                            templateUrl: '/siiFCA/includes/layout/sub-nav/sub-nav-docentes.html'
                        }
                    },
                    redirectTo: 'app.docentes.inicio'
                })
                .state('app.docentes.inicio',
                {
                    url: '/inicio',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/siiFCA/includes/docentes/inicio.html',
                            controller: 'docentesController',
                            controllerAs: 'vm' 
                        }
                    }
                })
                .state('app.docentes.avisos',
                {
                    url: '/avisos',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/siiFCA/includes/docentes/avisos.html',
                            controller: 'docentesAvisosController',
                            controllerAs: 'vm'                            
                        }
                    }
                })
                .state('app.docentes.eventos',
                {
                    url: '/eventos',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/siiFCA/includes/docentes/eventos.html',
                            controller: 'docentesEventosController',
                            controllerAs: 'vm' 
                        }
                    }
                })
                .state('app.docentes.expediente',
                {
                    url: '/expediente',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/siiFCA/includes/docentes/expediente.html',
                            controller: 'docentesExpedienteController',
                            controllerAs: 'vm' 
                        }
                    }
                })
                .state('app.docentes.constancias',
                {
                    url: '/constancias',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/siiFCA/includes/docentes/constancias.html',
                            controller: 'docentesConstanciasController',
                            controllerAs: 'vm' 
                        }
                    }
                })
                .state('app.admininten',
                {
                    url: '/siiFCA/admininten',
                    views:
                    {
                        'sidebar@':
                        {
                            templateUrl: '/siiFCA/includes/layout/sub-nav/sub-nav-admininten.html'
                        }
                    },
                    redirectTo: 'app.admininten.inicio'
                })
                .state('app.admininten.inicio',
                {
                    url: '/inicio',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/siiFCA/includes/admininten/inicio.html',
                            controller: 'adminintenController',
                            controllerAs: 'vm' 
                        }
                    }
                })
                .state('app.admininten.avisos',
                {
                    url: '/avisos',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/siiFCA/includes/admininten/avisos.html',
                            controller: 'adminintenAvisosController',
                            controllerAs: 'vm'                            
                        }
                    }
                })
                .state('app.admininten.eventos',
                {
                    url: '/eventos',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/siiFCA/includes/admininten/eventos.html',
                            controller: 'adminintenEventosController',
                            controllerAs: 'vm' 
                        }
                    }
                })
                .state('app.admininten.expediente',
                {
                    url: '/expediente',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/siiFCA/includes/admininten/expediente.html',
                            controller: 'adminintenExpedienteController',
                            controllerAs: 'vm' 
                        }
                    }
                })
                .state('app.admininten.constancias',
                {
                    url: '/constancias',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/siiFCA/includes/admininten/constancias.html',
                            controller: 'adminintenConstanciasController',
                            controllerAs: 'vm' 
                        }
                    }
                })
                .state('app.suad',
                {
                    url: '/siiFCA/suad',
                    views:
                    {
                        'sidebar@':
                        {
                            templateUrl: '/siiFCA/includes/layout/sub-nav/sub-nav-suad.html'
                        }
                    },
                    redirectTo: 'app.suad.inicio'
                })
                .state('app.suad.inicio',
                {
                    url: '/inicio',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/siiFCA/includes/admin/inicio.html',
                            controller: 'adminUserController',
                            controllerAs: 'vm' 
                        }
                    }
                })
                .state('app.suad.edocuenta',
                {
                    url: '/edocuenta',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/siiFCA/includes/suad/edocuenta.html',
                            controller: 'suadRecibosController',
                            controllerAs: 'vm' 
                        }
                    }
                })
                .state('app.suad.cargos',
                {
                    url: '/cargos',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/siiFCA/includes/suad/cargos.html',
                            controller: 'suadCargosController',
                            controllerAs: 'vm' 
                        }
                    }
                })
                .state('app.suad.abonos',
                {
                    url: '/abonos',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/siiFCA/includes/suad/abonos.html',
                            controller: 'suadAbonosController',
                            controllerAs: 'vm' 
                        }
                    }
                })
                .state('app.admin',
                {
                    url: '/siiFCA/admin',
                    views:
                    {
                        'sidebar@':
                        {
                            templateUrl: '/siiFCA/includes/layout/sub-nav/sub-nav-admin.html'
                        }
                    },
                    redirectTo: 'app.admin.inicio'
                })
                .state('app.admin.inicio',
                {
                    url: '/inicio',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/siiFCA/includes/admin/inicio.html',
                            controller: 'adminUserController',
                            controllerAs: 'vm' 
                        }
                    }
                })
                .state('app.admin.recibos',
                {
                    url: '/recibos',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/siiFCA/includes/admin/recibos.html',
                            controller: 'adminUserRecibosController',
                            controllerAs: 'vm' 
                        }
                    }
                })
                .state('app.admin.eventos',
                {
                    url: '/eventos',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/siiFCA/includes/admin/eventos.html',
                            controller: 'adminUserEventosController',
                            controllerAs: 'vm' 
                        }
                    }
                })
                .state('app.admin.creditos',
                {
                    url: '/creditos',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/siiFCA/includes/admin/creditos.html',
                            controller: 'adminUserCreditosController',
                            controllerAs: 'vm' 
                        }
                    }
                })
                .state('app.admin.creditosalumno',
                {
                    url: '/creditosalumno',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/siiFCA/includes/admin/creditos_alumno.html',
                            controller: 'adminUserCreditosAlumnoController',
                            controllerAs: 'vm' 
                        }
                    }
                })
                .state('app.admin.expediente',
                {
                    url: '/expedientes',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/siiFCA/includes/admin/expedientes.html',
                            controller: 'adminUserExpedienteController',
                            controllerAs: 'vm' 
                        }
                    }
                })
                .state('app.admin.constancias',
                {
                    url: '/constancias',
                    views:
                    {
                        'main@':
                        {
                            templateUrl: '/siiFCA/includes/admin/constancias.html',
                            controller: 'adminUserConstanciasController',
                            controllerAs: 'vm' 
                        }
                    }
                })
        })
        .run(['$rootScope', '$state', 'LayoutService', 'SessionService',function($rootScope, $state, LayoutService, SessionService)
        {
            $rootScope.$state = $state;
            $rootScope.LayoutService = LayoutService;
            $rootScope.SessionService = SessionService;
        
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams)
            {
                if (toState.redirectTo)
                {
                    event.preventDefault();
                    $state.go(toState.redirectTo, toParams)
                }
            });
        }]);

    angular.module('Controllers', []);
    angular.module('Directives', []);
    angular.module('Services', ['ngCookies']);
    // angular.module("lumx.data-table").run(['$templateCache', function(a) { a.removeAll()}]);
    
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

