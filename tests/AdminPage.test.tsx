import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminPage from "@/app/admin/page";
import { api } from "@/lib/api";
import type { PedidoGuardado } from "@/lib/types";

vi.mock("@/lib/api", () => ({
    api: { listar: vi.fn(), login: vi.fn(), crear: vi.fn(), actualizar: vi.fn(), eliminar: vi.fn(), listarPedidos: vi.fn(), cancelarPedido: vi.fn() },
}));

const productos = [{ id: 1, nombre: "Ratatouille", precio: 13.5, stock: 20 }];
const pedidos: PedidoGuardado[] = [{ id: 1, cliente: "Ana", telefono: null, notas: null, estado: "confirmado", total: 27, items: [] }];

describe("panel administrativo", () => {
    beforeEach(() => {
        sessionStorage.clear();
        vi.mocked(api.listar).mockResolvedValue(productos);
        vi.mocked(api.listarPedidos).mockResolvedValue([]);
    });

    afterEach(() => vi.clearAllMocks());

    it("exige iniciar sesión", async () => {
        render(<AdminPage />);
        expect(await screen.findByLabelText("Usuario")).toBeInTheDocument();
    });

    it("restaura la sesión si ya hay un token guardado", async () => {
        sessionStorage.setItem("admin-token", "abc");
        render(<AdminPage />);
        expect(await screen.findByText("Administrar productos")).toBeInTheDocument();
        await waitFor(() => expect(api.listar).toHaveBeenCalled());
    });

    it("inicia sesión y guarda el token en la sesión", async () => {
        vi.mocked(api.login).mockResolvedValue({ token: "abc" });
        render(<AdminPage />);
        await userEvent.type(screen.getByLabelText("Usuario"), "admin");
        await userEvent.type(screen.getByLabelText("Contraseña"), "admin123");
        await userEvent.click(screen.getByRole("button", { name: "Entrar" }));
        await waitFor(() => expect(sessionStorage.getItem("admin-token")).toBe("abc"));
        expect(await screen.findByText("Administrar productos")).toBeInTheDocument();
    });

    it("muestra el error si las credenciales son incorrectas", async () => {
        vi.mocked(api.login).mockRejectedValue(new Error("Credenciales incorrectas"));
        render(<AdminPage />);
        await userEvent.type(screen.getByLabelText("Usuario"), "admin");
        await userEvent.type(screen.getByLabelText("Contraseña"), "mala");
        await userEvent.click(screen.getByRole("button", { name: "Entrar" }));
        expect(await screen.findByRole("alert")).toHaveTextContent("Credenciales incorrectas");
    });

    it("limpia el error de credenciales al volver a intentarlo", async () => {
        vi.mocked(api.login).mockRejectedValueOnce(new Error("Credenciales incorrectas")).mockResolvedValue({ token: "abc" });
        render(<AdminPage />);
        await userEvent.type(screen.getByLabelText("Usuario"), "admin");
        await userEvent.type(screen.getByLabelText("Contraseña"), "mala");
        await userEvent.click(screen.getByRole("button", { name: "Entrar" }));
        await screen.findByRole("alert");

        await userEvent.click(screen.getByRole("button", { name: "Entrar" }));
        await screen.findByText("Administrar productos");
        expect(screen.queryByText("Credenciales incorrectas")).not.toBeInTheDocument();
    });

    it("crea un producto", async () => {
        sessionStorage.setItem("admin-token", "abc");
        vi.mocked(api.crear).mockResolvedValue({ id: 9, nombre: "Nuevo", precio: 3, stock: 1 });
        render(<AdminPage />);
        await screen.findByText("Administrar productos");
        await userEvent.type(screen.getByPlaceholderText("Nombre"), "Nuevo");
        await userEvent.type(screen.getByPlaceholderText("Precio"), "3");
        await userEvent.type(screen.getByPlaceholderText("Stock"), "1");
        await userEvent.click(screen.getByRole("button", { name: "Crear" }));
        await waitFor(() =>
            expect(api.crear).toHaveBeenCalledWith({ nombre: "Nuevo", precio: 3, stock: 1 }, "abc"),
        );
    });

    it("elimina un producto", async () => {
        sessionStorage.setItem("admin-token", "abc");
        vi.mocked(api.eliminar).mockResolvedValue(undefined);
        render(<AdminPage />);
        await screen.findByText("Administrar productos");
        await userEvent.click(screen.getByRole("button", { name: "Eliminar" }));
        await waitFor(() => expect(api.eliminar).toHaveBeenCalledWith(1, "abc"));
    });

    it("recarga productos y pedidos al cancelar un pedido", async () => {
        sessionStorage.setItem("admin-token", "abc");
        vi.mocked(api.listarPedidos).mockResolvedValue(pedidos);
        vi.mocked(api.cancelarPedido).mockResolvedValue({ ...pedidos[0], estado: "cancelado" });
        render(<AdminPage />);
        await screen.findByText("Administrar productos");
        await screen.findByText("Pedido #1");
        const llamadasAntes = vi.mocked(api.listar).mock.calls.length;

        await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));

        await waitFor(() => expect(vi.mocked(api.listar).mock.calls.length).toBe(llamadasAntes + 1));
        await waitFor(() => expect(vi.mocked(api.listarPedidos).mock.calls.length).toBeGreaterThan(1));
    });

    it("cierra la sesión y borra el token", async () => {
        sessionStorage.setItem("admin-token", "abc");
        render(<AdminPage />);
        await screen.findByText("Administrar productos");
        await userEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }));
        expect(await screen.findByLabelText("Usuario")).toBeInTheDocument();
        expect(sessionStorage.getItem("admin-token")).toBeNull();
    });
});