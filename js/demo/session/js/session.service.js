(function() {
    'use strict';

    angular
        .module('Services')
        .service('SessionService', SessionService);

    SessionService.$inject = ['$cookies'];

    function SessionService($cookies) {
        var service = this;

        service.sessionIsOpen = false;
        service.sessionState = sessionState;
        service.sessionId = sessionId;
        service.sessionUser = sessionUser;
        service.sessionAlumno = sessionAlumno;
        service.sessionDocente = sessionDocente;
        service.sessionAdmin = sessionAdmin;
        service.sessionPermisos = sessionPermisos;
        service.sessionCuentaAlumno = sessionCuentaAlumno;
        
        ////////////

        function sessionState() {
            service.sessionIsOpen = ($cookies.get('siifca_sid') === undefined) ? false : true ;
            return service.sessionIsOpen;
        }

        function sessionId() {
            return ($cookies.get('siifca_sid') !== undefined) ? $cookies.get('siifca_sid') : null ;
        }

        function sessionUser() {    // sesión de Usuario...administradores...
            return ($cookies.get('siifca_usr') !== undefined) ? $cookies.get('siifca_usr') : null ;
        }

        function sessionAlumno() {    // sesión de alumno
            return ($cookies.get('siifca_alu') !== undefined) ? $cookies.get('siifca_alu') : null ;
        }

        function sessionDocente() { // sesión de docente
            return ($cookies.get('siifca_doc') !== undefined) ? $cookies.get('siifca_doc') : null ;
        }

        function sessionAdmin() {    // sesión de administrativo/intendencia
            return ($cookies.get('siifca_adv') !== undefined) ? $cookies.get('siifca_adv') : null ;
        }

        function sessionPermisos() {    // sesión de administrativo/intendencia
            return ($cookies.get('siifca_per') !== undefined) ? $cookies.get('siifca_per') : 
                '{ "tipo": "usuario", "recibos": false, "constancias": false, "expediente": false, "eventos": false, "creditos": false }' ;
        }

        function sessionCuentaAlumno() {    // sesión de alumno
            return ($cookies.get('siifca_alu')) ;
        }

    }
})();