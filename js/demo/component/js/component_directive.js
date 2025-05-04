(function()
{
    'use strict';

    angular
        .module('Directives')
        .directive('lxComponent', lxComponent)
        .directive('lxComponentAttributes', lxComponentAttributes)
        .directive('lxComponentMethods', lxComponentMethods)
        .directive('lxComponentMethod', lxComponentMethod);

    function lxComponent()
    {
        return {
            restrict: 'E',
            templateUrl: '/siiFCA/js/demo/component/views/component.html',
            scope: true,
            link: link,
            controller: LxComponentController,
            controllerAs: 'lxComponent',
            bindToController: true,
            transclude: true
        };

        function link(scope, element, attrs, ctrl)
        {
            scope.lxComponent.isOpen = false;
            scope.lxComponent.iconOpen = "mdi-help-circle";
            scope.lxComponent.iconColor = "tc-green-500";

            attrs.$observe('lxIsOpen', function(newIsOpen)
            {
                scope.lxComponent.isOpen = newIsOpen;
            });

            attrs.$observe('id', function(_newId)
            {
                ctrl.id = _newId;
                scope.lxComponent.id = _newId;
            });

            attrs.$observe('lxIconOpen', function(newIconOpen)
            {
                scope.lxComponent.iconOpen = newIconOpen;
            });

            attrs.$observe('lxIconColor', function(newIconColor)
            {
                scope.lxComponent.iconColor = newIconColor;
            });

            attrs.$observe('lxJsPath', function(newJsPath)
            {
                scope.lxComponent.jsPath = newJsPath;
            });

            attrs.$observe('lxActionPath', function(newActionPath)
            {
                scope.lxComponent.actionPath = newActionPath;
            });

            attrs.$observe('lxActionTitle', function(newActionTitle)
            {
                scope.lxComponent.actionTitle = newActionTitle;
            });

            scope.lxComponent.language = 'Ayuda';

            attrs.$observe('lxLanguage', function(newLanguage)
            {
                scope.lxComponent.language = newLanguage;
            });

            scope.lxComponent.noDemo = false;

            attrs.$observe('lxNoDemo', function(newNoDemo)
            {
                scope.lxComponent.noDemo = newNoDemo;
            });

            attrs.$observe('lxPath', function(newPath)
            {
                scope.lxComponent.path = newPath;
            });

            attrs.$observe('lxTitle', function(newTitle)
            {
                scope.lxComponent.title = newTitle;
            });

            attrs.$observe('lxHelp', function(newHelp)
            {
                scope.lxComponent.help = newHelp;
            });

        }
    }

    LxComponentController.$inject = ['$transclude', '$rootScope'];

    function LxComponentController($transclude, $rootScope)
    {
        var lxComponent = this;

        lxComponent.toggle = toggle;
        lxComponent.close  = close;

        $rootScope.$on('lx-component__close', function(event, id, canceled, params)
        {
            if (id === lxComponent.id)
            {
                close(canceled, params);
            }
        });
        
        $transclude(function(clone)
        {
            if (clone.length)
            {
                lxComponent.hasTranscluded = true;
            }
        });

        ////////////

        function toggle()
        {
            lxComponent.isOpen = !lxComponent.isOpen;
        }

        function close(_canceled, _params) {
            if (!lxComponent.isOpen) {
                return;
            }
            lxComponent.isOpen = false;
        }
    }

    function lxComponentAttributes()
    {
        return {
            restrict: 'E',
            templateUrl: '/siiFCA/js/demo/component/views/component-attributes.html',
            transclude: true
        };
    }

    function lxComponentMethods()
    {
        return {
            restrict: 'E',
            templateUrl: '/siiFCA/js/demo/component/views/component-methods.html',
            scope: true,
            link: link,
            controller: LxComponentMethodsController,
            controllerAs: 'lxComponentMethods',
            bindToController: true,
            transclude: true
        };

        function link(scope, element, attrs)
        {
            attrs.$observe('lxTitle', function(newTitle)
            {
                scope.lxComponentMethods.title = newTitle;
            });
        }
    }

    function LxComponentMethodsController()
    {
        var lxComponentMethods = this;
    }

    function lxComponentMethod()
    {
        return {
            restrict: 'E',
            templateUrl: '/siiFCA/js/demo/component/views/component-method.html',
            scope: true,
            link: link,
            controller: LxComponentMethodController,
            controllerAs: 'lxComponentMethod',
            bindToController: true,
            transclude: true
        };

        function link(scope, element, attrs)
        {
            attrs.$observe('lxName', function(newName)
            {
                scope.lxComponentMethod.name = newName;
            });

            attrs.$observe('lxDescription', function(newDescription)
            {
                scope.lxComponentMethod.description = newDescription;
            });
        }
    }

    function LxComponentMethodController()
    {
        var lxComponentMethod = this;
    }
})();


