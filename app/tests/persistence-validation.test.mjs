import assert from "node:assert/strict";
import test from "node:test";

const {
  validarString,
  validarBooleano,
  validarNumeroInteiro,
  validarCentavos,
  validarPercentual,
  validarUUID,
  validarDataISO,
  validarDateTimeISO,
  validarEnum,
  validarCampoOpcional,
  validarJSON,
  validarRegistro,
} = await import("../lib/persistence/validation/validators.ts");

test("validates required and optional strings", () => {
  assert.deepEqual(validarString("Conta", "nome"), []);
  assert.equal(validarString("", "nome").length, 1);
  assert.equal(validarString(undefined, "nome").length, 1);
  assert.deepEqual(validarString(undefined, "nome", false), []);
  assert.equal(validarString(123, "nome").length, 1);
});

test("validates boolean values", () => {
  assert.deepEqual(validarBooleano(true, "ativa"), []);
  assert.deepEqual(validarBooleano(false, "ativa"), []);
  assert.equal(validarBooleano("true", "ativa").length, 1);
});

test("validates safe integers", () => {
  assert.deepEqual(validarNumeroInteiro(100, "valor"), []);
  assert.deepEqual(validarNumeroInteiro(-100, "valor"), []);
  assert.equal(validarNumeroInteiro(1.5, "valor").length, 1);
  assert.equal(
    validarNumeroInteiro(Number.MAX_SAFE_INTEGER + 1, "valor").length,
    1,
  );
  assert.equal(validarNumeroInteiro("100", "valor").length, 1);
});

test("validates monetary values in centavos", () => {
  assert.deepEqual(validarCentavos(0, "valor"), []);
  assert.deepEqual(validarCentavos(1500, "valor"), []);
  assert.equal(validarCentavos(-1, "valor").length, 1);
  assert.equal(validarCentavos(10.5, "valor").length, 1);
  assert.deepEqual(validarCentavos(-100, "ajuste", -100), []);
});

test("validates percentages in basis points", () => {
  assert.deepEqual(validarPercentual(0, "percentual"), []);
  assert.deepEqual(validarPercentual(100, "percentual"), []);
  assert.deepEqual(validarPercentual(10000, "percentual"), []);
  assert.equal(validarPercentual(-1, "percentual").length, 1);
  assert.equal(validarPercentual(10001, "percentual").length, 1);
  assert.equal(validarPercentual(10.5, "percentual").length, 1);
});

test("validates UUID identifiers", () => {
  assert.deepEqual(
    validarUUID("550e8400-e29b-41d4-a716-446655440000", "id"),
    [],
  );
  assert.equal(validarUUID("conta-1", "id").length, 1);
  assert.equal(validarUUID("", "id").length, 1);
  assert.equal(validarUUID(123, "id").length, 1);
});

test("validates calendar dates in ISO format", () => {
  assert.deepEqual(validarDataISO("2026-11-03", "data"), []);
  assert.equal(validarDataISO("2026-02-30", "data").length, 1);
  assert.equal(validarDataISO("2026-13-01", "data").length, 1);
  assert.equal(validarDataISO("03/11/2026", "data").length, 1);
});

test("validates ISO timestamps with explicit timezone", () => {
  assert.deepEqual(
    validarDateTimeISO("2026-11-03T12:00:00.000Z", "createdAt"),
    [],
  );
  assert.deepEqual(
    validarDateTimeISO("2026-11-03T09:00:00-03:00", "createdAt"),
    [],
  );
  assert.equal(
    validarDateTimeISO("2026-11-03T12:00:00", "createdAt").length,
    1,
  );
  assert.equal(validarDateTimeISO("data inválida", "createdAt").length, 1);
});

test("validates allowed enum values", () => {
  const tipos = ["bancaria", "carteira_fisica"];

  assert.deepEqual(validarEnum("bancaria", "tipo", tipos), []);
  assert.equal(validarEnum("poupanca", "tipo", tipos).length, 1);
  assert.equal(validarEnum(123, "tipo", tipos).length, 1);
});

test("validates optional fields only when present", () => {
  const registro = { nome: "Conta" };

  assert.deepEqual(
    validarCampoOpcional(registro, "descricao", validarString),
    [],
  );

  assert.deepEqual(
    validarCampoOpcional(
      { descricao: "Descrição" },
      "descricao",
      validarString,
    ),
    [],
  );

  assert.equal(
    validarCampoOpcional({ descricao: 123 }, "descricao", validarString).length,
    1,
  );
});

test("validates JSON-compatible values", () => {
  assert.deepEqual(validarJSON(null, "valor"), []);
  assert.deepEqual(validarJSON("texto", "valor"), []);
  assert.deepEqual(validarJSON(100, "valor"), []);
  assert.deepEqual(validarJSON({ nome: "Conta" }, "valor"), []);
  assert.deepEqual(validarJSON([1, "dois", true], "valor"), []);

  assert.equal(validarJSON(undefined, "valor").length, 1);
  assert.equal(validarJSON(() => {}, "valor").length, 1);
  assert.equal(validarJSON(Number.NaN, "valor").length, 1);

  const circular = {};
  circular.self = circular;

  assert.equal(validarJSON(circular, "valor").length, 1);
});

test("validates that a record is an object", () => {
  assert.deepEqual(validarRegistro({ id: "123" }), {
    valido: true,
    erros: [],
  });

  assert.equal(validarRegistro(null).valido, false);
  assert.equal(validarRegistro([]).valido, false);
  assert.equal(validarRegistro("texto").valido, false);
});
