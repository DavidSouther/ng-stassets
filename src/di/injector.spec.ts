/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />

import { expect } from 'chai';

import {
  Injector,
  Binding
} from './di';

describe('Rupert DI', function() {
  describe('Injector', function() {
    it('statically creates new injectors', function() {
      let injector = Injector.create([]);
      expect(injector).to.not.be.undefined;
    });

    it('retrieves simple values', function() {
      let injector = Injector.create(
        [ new Binding(Number, { toValue: 42 }) ]
      );
      expect(injector.get(Number)).to.equal(42);
    });

    describe('classes and aliases', function() {
      class Vehicle {}
      class Car extends Vehicle {}
      it('instantiates classes', function(){
        var injectorClass = Injector.create([
          new Binding(Car, { toClass: Car }),
          new Binding(Vehicle, { toClass: Car })
        ]);
        expect(injectorClass.get(Vehicle)).to.not.equal(injectorClass.get(Car));
        expect(injectorClass.get(Vehicle) instanceof Car).to.equal(true);
      });

      // it('instantiates aliases as singletons', function() {
      //   var injectorAlias = Injector.create([
      //     new Binding(Car, { toClass: Car }),
      //     new Binding(Vehicle, { toAlias: Car })
      //   ]);
      //   expect(injectorAlias.get(Vehicle)).to.equal(injectorAlias.get(Car));
      //   expect(injectorAlias.get(Vehicle) instanceof Car).to.equal(true);
      // });
    });

    describe('factories', function(){
      it('executes a factory', function() {
        var injector = Injector.create([
          new Binding(Number, { toFactory: () => { return 1+2; }})
        ]);
        expect(injector.get(Number)).to.equal(3);
      });

      it('injects dependencies into a factory', function(){
        var injector = Injector.create([
          new Binding(Number, { toFactory: () => { return 1+2; }}),
          new Binding(String, {
            toFactory: (value: Number) => { return "Value: " + value; },
            dependencies: [Number]
          })
        ]);
        expect(injector.get(Number)).to.equal(3);
        expect(injector.get(String)).to.equal('Value: 3');
      });
    });

    it('throws an exception retrieving unbound values', function() {
      var injector = Injector.create([]);
      expect((() => injector.get(Number)))
        .to.throw(/Injector does not have type /);
    });
  });
});