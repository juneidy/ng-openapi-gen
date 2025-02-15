import { InterfaceDeclaration, TypeAliasDeclaration, TypescriptParser } from 'typescript-parser';
import { NgOpenApiGen } from '../lib/ng-openapi-gen';
import options from './polymorphic.config.json';
import selfRef from './polymorphic.json';

const gen = new NgOpenApiGen(selfRef, options);
gen.generate();

describe('Generation of derived classes using polymorphic.json (as is generated by Swashbuckle)', () => {
  it('Tazk model', (done) => {
    const tazk = gen.models.get('Foo.Bar.Tazk');
    const ts = gen.templates.apply('model', tazk);
    const parser = new TypescriptParser();
    parser.parseSource(ts).then((ast) => {
      expect(ast.declarations.length).toBe(1);
      expect(ast.declarations[0]).toEqual(jasmine.any(TypeAliasDeclaration));
      const decl = ast.declarations[0] as TypeAliasDeclaration;
      expect(decl.name).toBe('FooBarTazk');
      const text = ts.substring(decl.start || 0, decl.end || ts.length);
      expect(text.replace(/\n/g, ' ')).toContain('FooBarTazk = FooBarTazkBase & { \'taskNumber\'?: number; }');
      done();
    });
  });

  it('Dooz model', (done) => {
    const tazk = gen.models.get('Foo.Bar.Dooz');
    const ts = gen.templates.apply('model', tazk);
    const parser = new TypescriptParser();
    parser.parseSource(ts).then((ast) => {
      expect(ast.declarations.length).toBe(1);
      expect(ast.declarations[0]).toEqual(jasmine.any(InterfaceDeclaration));
      const decl = ast.declarations[0] as InterfaceDeclaration;
      expect(decl.name).toBe('FooBarDooz');
      expect(decl.properties).toHaveSize(1);
      expect(decl.properties[0].name).toBe('doozObject');
      expect(decl.properties[0].type).toBe('FooBarTazk & {\n\'doozNumber\'?: number;\n}');
      done();
    });
  });

  it('DiscBase model', (done) => {
    const baze = gen.models.get('Foo.Bar.DiscBase');
    const ts = gen.templates.apply('model', baze);
    const parser = new TypescriptParser();
    parser.parseSource(ts).then((ast) => {
      expect(ast.declarations.length).toBe(1);
      expect(ast.declarations[0]).toEqual(jasmine.any(InterfaceDeclaration));
      const decl = ast.declarations[0] as InterfaceDeclaration;
      expect(decl.name).toBe('FooBarDiscBase');
      expect(decl.properties).toHaveSize(2);
      expect(decl.properties[0].name).toBe('$type');
      expect(decl.properties[0].type).toBe('string');
      expect(decl.properties[1].name).toBe('description');
      expect(decl.properties[1].type).toBe('string');
      done();
    });
  });

  it('DiscOne model', (done) => {
    const one = gen.models.get('Foo.Bar.DiscOne');
    const ts = gen.templates.apply('model', one);
    const parser = new TypescriptParser();
    parser.parseSource(ts).then((ast) => {
      expect(ast.declarations.length).toBe(1);
      expect(ast.declarations[0]).toEqual(jasmine.any(TypeAliasDeclaration));
      const decl = ast.declarations[0] as TypeAliasDeclaration;
      expect(decl.name).toBe('FooBarDiscOne');
      const text = ts.substring(decl.start || 0, decl.end || ts.length);
      expect(text.replace(/\n/g, ' ')).toContain('FooBarDiscOne = FooBarDiscBase & { \'$type\': \'disc-1\'; \'discNumber\'?: number; }');
      done();
    });
  });

  it('DiscTwo model', (done) => {
    const two = gen.models.get('Foo.Bar.DiscTwo');
    const ts = gen.templates.apply('model', two);
    const parser = new TypescriptParser();
    parser.parseSource(ts).then((ast) => {
      expect(ast.declarations.length).toBe(1);
      expect(ast.declarations[0]).toEqual(jasmine.any(TypeAliasDeclaration));
      const decl = ast.declarations[0] as TypeAliasDeclaration;
      expect(decl.name).toBe('FooBarDiscTwo');
      const text = ts.substring(decl.start || 0, decl.end || ts.length);
      expect(text.replace(/\n/g, ' ')).toContain('FooBarDiscTwo = FooBarDiscBase & { \'$type\': \'disc-2\'; \'discText\'?: string; }');
      done();
    });
  });
});
