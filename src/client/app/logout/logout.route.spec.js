/* jshint -W117, -W030 */
describe('logout routes', function () {
    describe('state', function () {
        var view = 'app/logout/logout.html';

        beforeEach(function() {
            module('app.logout', bard.fakeToastr);
            bard.inject('$httpBackend', '$location', '$rootScope', '$state', '$templateCache');
        });

        beforeEach(function() {
            $templateCache.put(view, '');
        });

        bard.verifyNoOutstandingHttpRequests();

        it('should map state logout to url / ', function() {
            expect($state.href('logout', {})).to.equal('/');
        });

        it('should map /logout route to logout View template', function () {
            expect($state.get('logout').templateUrl).to.equal(view);
        });

        it('of logout should work with $state.go', function () {
            $state.go('logout');
            $rootScope.$apply();
            expect($state.is('logout'));
        });
    });
});
