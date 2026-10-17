import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/lib/api";

const ok = (data: unknown, status = 200) =>
    Promise.resolve(new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }));

describe("cliente api", () => {
    beforeEach(() => {
        vi.stubGlobal("fetch", vi.fn());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("lista los productos", async () => {
        const productos = [{ id: 1, nombre: "Producto", precio: 10, stock: 3 }];
        vi.mocked(fetch).mockReturnValue(ok(productos));
        await expect(api.listar()).resolves.toEqual(productos);
    });

    it("envía el token en las escrituras", async () => {
        vi.mocked(fetch).mockReturnValue(ok({ id: 2, nombre: "Nuevo", precio: 5, stock: 1 }, 201));
        await api.crear({ nombre: "Nuevo", precio: 5, stock: 1 }, "token123");
        const [, opciones] = vi.mocked(fetch).mock.calls[0];
        expect((opciones?.headers as Record<string, string>).Authorization).toBe("Bearer token123");
    });

    it("no devuelve cuerpo en DELETE 204", async () => {
        vi.mocked(fetch).mockReturnValue(Promise.resolve(new Response(null, { status: 204 })));
        await expect(api.eliminar(1, "token123")).resolves.toBeUndefined();
    });

    it("propaga el error de la API", async () => {
        vi.mocked(fetch).mockReturnValue(ok({ error: "Producto no encontrado" }, 404));
        await expect(api.listar()).rejects.toThrow("Producto no encontrado");
    });

    it("usa un mensaje genérico si el error no trae cuerpo", async () => {
        vi.mocked(fetch).mockReturnValue(Promise.resolve(new Response("sin cuerpo", { status: 500 })));
        await expect(api.listar()).rejects.toThrow("No se pudo comunicar con el servidor");
    });

    it("crea un pedido con sus lineas", async () => {
        vi.mocked(fetch).mockReturnValue(ok({ id: 7, total: 20 }, 201));
        await api.crearPedido({ cliente: "Ana", items: [{ productoId: 1, cantidad: 2 }] });
        const [url, opciones] = vi.mocked(fetch).mock.calls[0];
        expect(url).toContain("/api/pedidos");
        expect(JSON.parse(String(opciones?.body))).toEqual({ cliente: "Ana", items: [{ productoId: 1, cantidad: 2 }] });
    });

    it("cancela un pedido con token", async () => {
        vi.mocked(fetch).mockReturnValue(ok({ id: 7, estado: "cancelado" }));
        await api.cancelarPedido(7, "token123");
        const [url, opciones] = vi.mocked(fetch).mock.calls[0];
        expect(url).toContain("/api/pedidos/7/cancelar");
        expect((opciones?.headers as Record<string, string>).Authorization).toBe("Bearer token123");
    });
});