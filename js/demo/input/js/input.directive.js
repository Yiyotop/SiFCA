(function() {
    'use strict';

    angular
        .module('Directives')
        .directive('soloNumeros', soloNumeros)
        .directive('soloMayusculas', soloMayusculas)
        .directive('soloMinusculas', soloMinusculas)
        .directive('inputMask', inputMask);

    function inputMask() {          // incorpora InputMask https://github.com/RobinHerbots/Inputmask
        return {
            restrict: 'A',
            require: 'ngModel',
            controllerAs: 'inpMask',
            bindToController: true,
            link: link
        };
    
        function link(scope, element, attrs, ctrl, transclude) {
            var inpMask = this;

            if(angular.isDefined(attrs.mask)) {         // tiene mascara de control...
                var jquery_el = $(element);
                var option = scope.$parent.$eval(attrs.mask);
                //jquery_el.inputmask({mask: attrs.mask});

                if (angular.isDefined(option.mask)) {
                    jquery_el.inputmask({mask: option.mask});
                }
                if (angular.isDefined(option.autoUnmask)) { 
                    jquery_el.inputmask({autoUnmask: option.autoUnmask});
                }
                if (angular.isDefined(option.clearMaskOnLostFocus)) { 
                    jquery_el.inputmask({clearMaskOnLostFocus: option.clearMaskOnLostFocus});
                }
                if (angular.isDefined(option.alias)) {
                    jquery_el.inputmask({alias: option.alias});
                }
                if (angular.isDefined(option.numericInput)) {
                    jquery_el.inputmask({numericInput: option.numericInput});
                }
                if (angular.isDefined(option.rightAlign)) {
                    jquery_el.inputmask({rightAlign: option.rightAlign});
                }
                if (angular.isDefined(option.greedy)) {
                    jquery_el.inputmask({greedy: option.greedy});
                }
                if (angular.isDefined(option.maskUpper)) {
                    jquery_el.inputmask({mask: option.maskUpper, 
                        definitions: {'a': { validator: "[A-Za-z.:,;&#\'\" áéíóúñÁÉÍÓÚÑäëïöüÄËÏÖÜ']", cardinality: 1, casing: "upper"}}
                    });
                }
                if (angular.isDefined(option.maskUpperNum)) {
                    jquery_el.inputmask({mask: option.maskUpperNum, 
                        definitions: {'x': { validator: "[A-Za-z0-9.:,;&#\'\"\-<>()\/ áéíóúñÁÉÍÓÚÑäëïöüÄËÏÖÜ']", cardinality: 1, casing: "upper"}}
                    });
                }
                if (angular.isDefined(option.maskText)) {
                    jquery_el.inputmask({mask: option.maskText, 
                        definitions: {'x': { validator: "[A-Za-z0-9.:,;&#%$\'\"\-_<>()\/!¿?\\ áéíóúñÁÉÍÓÚÑäëïöüÄËÏÖÜ']", cardinality: 1 }}
                    });
                }
                if (angular.isDefined(option.maskMixed)) {
                    jquery_el.inputmask({mask: option.maskMixed, 
                        definitions: { 'A': { validator: "[A-Za-z]", cardinality: 1, casing: "upper"},
                                       '9': { validator: "[0-9]", cardinality: 1},
                                       '*': { validator: "[A-Za-z0-9]", cardinality: 1, casing: "upper"}
                        }
                    });
                }

                jquery_el.on('keyup paste focus blur', function() {
                    var val = $(this).val();
                    
                    ctrl.$setViewValue(val);
                    ctrl.$render();
                });
            }
        }
    } ///// input-mask...

    function soloNumeros() {
        return {
            restrict: 'A',
            require: 'ngModel',
            controllerAs: 'dam',
            link: link
        };
    
        function link(scope, element, attrs, ctrl) {
            var dam = this;

            dam.validateNumber = validateNumber;

            ctrl.$parsers.unshift(dam.validateNumber);
            ctrl.$parsers.push(dam.validateNumber);
            attrs.$observe('notEmpty', function () {
                validateNumber(ctrl.$viewValue);
            });        

            function validateNumber(inputValue) {
                var maxLength = 8;
                if (attrs.max) {
                    maxLength = attrs.max;
                }
                if (inputValue === undefined) {
                    return '';
                }
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if (transformedInput !== inputValue) {
                    ctrl.$setViewValue(transformedInput);
                    ctrl.$render();
                }
                if (transformedInput.length > maxLength) {
                    transformedInput = transformedInput.substring(0, maxLength);
                    ctrl.$setViewValue(transformedInput);
                    ctrl.$render();
                }
                var isNotEmpty = (transformedInput.length === 0) ? true : false;
                ctrl.$setValidity('notEmpty', isNotEmpty);
                return transformedInput;
            }
        }
    }

    /////// convierte la entrada en Mayúsculas...
    function soloMayusculas() {
        return {
            restrict: 'A',
            require: 'ngModel',
            controllerAs: 'dam',
            link: link
        };
    
        function link(scope, element, attrs, ctrl) {
            var dam = this;

            dam.pasaMayusculas = pasaMayusculas;

            ctrl.$parsers.unshift(dam.pasaMayusculas);
            ctrl.$parsers.push(dam.pasaMayusculas);
            attrs.$observe('notEmpty', function () {
                pasaMayusculas(ctrl.$viewValue);
            });        

            function pasaMayusculas(inputValue) {
                var maxLength = 10;
                if (attrs.max) {
                    maxLength = attrs.max;
                }
                if (inputValue === undefined || inputValue === null) {
                    return '';
                }
                var transformedInput = inputValue.toUpperCase();
                if (transformedInput !== inputValue) {
                    ctrl.$setViewValue(transformedInput);
                    ctrl.$render();
                }
                if (transformedInput.length > maxLength) {
                    transformedInput = transformedInput.substring(0, maxLength);
                    ctrl.$setViewValue(transformedInput);
                    ctrl.$render();
                }
                var isNotEmpty = (transformedInput.length === 0) ? true : false;
                ctrl.$setValidity('notEmpty', isNotEmpty);
                return transformedInput;
            }
        }
    }

    /////// convierte la entrada en Mayúsculas...
    function soloMinusculas() {
        return {
            restrict: 'A',
            require: 'ngModel',
            controllerAs: 'dam',
            link: link
        };
    
        function link(scope, element, attrs, ctrl) {
            var dam = this;

            dam.pasaMinusculas = pasaMinusculas;

            ctrl.$parsers.unshift(dam.pasaMinusculas);
            ctrl.$parsers.push(dam.pasaMinusculas);
            attrs.$observe('notEmpty', function () {
                pasaMinusculas(ctrl.$viewValue);
            });        

            function pasaMinusculas(inputValue) {
                var maxLength = 10;
                if (attrs.max) {
                    maxLength = attrs.max;
                }
                if (inputValue === undefined || inputValue === null) {
                    return '';
                }
                var transformedInput = inputValue.toLowerCase();
                if (transformedInput !== inputValue) {
                    ctrl.$setViewValue(transformedInput);
                    ctrl.$render();
                }
                if (transformedInput.length > maxLength) {
                    transformedInput = transformedInput.substring(0, maxLength);
                    ctrl.$setViewValue(transformedInput);
                    ctrl.$render();
                }
                var isNotEmpty = (transformedInput.length === 0) ? true : false;
                ctrl.$setValidity('notEmpty', isNotEmpty);
                return transformedInput;
            }
        }
    }
    
})();