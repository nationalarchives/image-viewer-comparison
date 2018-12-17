define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SynchronousRequire = /** @class */ (function () {
        function SynchronousRequire() {
        }
        SynchronousRequire.load = function (deps, cb) {
            var loaders = [];
            for (var i = 0; i < deps.length; i++) {
                var depLoader = new DependencyLoader(i, deps[i], deps, cb);
                loaders.push(depLoader);
            }
            var sequence = Promise.resolve();
            loaders.forEach(function (loader) {
                sequence = sequence.then(function () {
                    return loader.load();
                });
            });
            return sequence;
        };
        return SynchronousRequire;
    }());
    exports.SynchronousRequire = SynchronousRequire;
    var DependencyLoader = /** @class */ (function () {
        function DependencyLoader(index, dep, deps, cb) {
            this._dep = dep;
            this._deps = deps;
            this._cb = cb;
            this._index = index;
        }
        DependencyLoader.prototype.getDependencyIndex = function (dep) {
            return this._deps.findIndex(function (el) { return el.includes(dep); });
        };
        DependencyLoader.prototype.load = function () {
            var that = this;
            return new Promise(function (resolve) {
                requirejs([that._dep], function (dep) {
                    that._cb(that._index, dep);
                    resolve();
                });
            });
        };
        return DependencyLoader;
    }());
    exports.DependencyLoader = DependencyLoader;
});
