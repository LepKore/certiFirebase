import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PedidoSection from "@/components/pedidos/PedidoSection";
import HistorialPage from "@/app/pedidos/page";

const api = vi.hoisted(() => ({
  listar: vi.fn(),
  crearPedido: vi.fn(),
  listarPedidos: vi.fn(),
}));

vi.mock("@/lib/api", () => ({ api }));

const paella = { id: 1, nombre: "Paella", precio: 10, stock: 3 };
const tarta = { id: 2, nombre: "Tarta", precio: 5, stock: 0 };

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  api.listar.mockResolvedValue([paella, tarta]);
  api.listarPedidos.mockResolvedValue([]);
});

describe("PedidoSection", () => {
  it("muestra los platos con su stock", async () => {
    render(<PedidoSection />);
    expect(await screen.findByText("Paella")).toBeInTheDocument();
    expect(screen.getByText("Stock disponible: 3")).toBeInTheDocument();
  });

  it("marca como agotado el plato sin stock", async () => {
    render(<PedidoSection />);
    expect(await screen.findByRole("button", { name: "Agotado" })).toBeDisabled();
  });

  it("añade un plato al pedido y calcula el total", async () => {
    render(<PedidoSection />);
    await screen.findByText("Paella");
    await userEvent.click(screen.getAllByRole("button", { name: "Añadir al pedido" })[0]);
    expect(screen.getAllByText("10.00 €").length).toBe(3);
  });

  it("guarda solo el id y la cantidad en el carrito", async () => {
    render(<PedidoSection />);
    await screen.findByText("Paella");
    await userEvent.click(screen.getAllByRole("button", { name: "Añadir al pedido" })[0]);
    expect(JSON.parse(localStorage.getItem("ratatouille-carrito") ?? "[]")).toEqual([{ productoId: 1, cantidad: 1 }]);
  });

  it("no deja añadir más unidades que el stock", async () => {
    api.listar.mockResolvedValue([{ id: 3, nombre: "Guiso", precio: 4, stock: 1 }]);
    render(<PedidoSection />);
    await screen.findByText("Guiso");
    const boton = screen.getByRole("button", { name: "Añadir al pedido" });
    await userEvent.click(boton);
    await userEvent.click(boton);
    expect(screen.getByRole("alert")).toHaveTextContent("No quedan más unidades de Guiso");
  });

  it("descarta del carrito las líneas cuyo producto ya no existe", async () => {
    localStorage.setItem("ratatouille-carrito", JSON.stringify([{ productoId: 99, cantidad: 2 }]));
    render(<PedidoSection />);
    await screen.findByText("Paella");
    expect(screen.getByText("Tu pedido está vacío.")).toBeInTheDocument();
    expect(screen.queryByText("99")).not.toBeInTheDocument();
  });

  it("envía el pedido y avisa de que queda en el historial", async () => {
    api.crearPedido.mockResolvedValue({ id: 7, cliente: "Ana", total: 10, estado: "confirmado", items: [] });
    render(<PedidoSection />);
    await screen.findByText("Paella");
    await userEvent.click(screen.getAllByRole("button", { name: "Añadir al pedido" })[0]);
    await userEvent.type(screen.getByPlaceholderText("Nombre"), "Ana");
    await userEvent.click(screen.getByRole("button", { name: "Confirmar pedido" }));
    await waitFor(() => expect(api.crearPedido).toHaveBeenCalledWith({ cliente: "Ana", items: [{ productoId: 1, cantidad: 1 }], telefono: undefined, notas: undefined }));
    expect(await screen.findByText(/Pedido #7 guardado/)).toBeInTheDocument();
  });

  it("limpia el formulario y el carrito tras confirmar, sin mostrar errores", async () => {
    api.crearPedido.mockResolvedValue({ id: 8, cliente: "Ana", total: 10, estado: "confirmado", items: [] });
    api.listar.mockResolvedValueOnce([paella, tarta]).mockResolvedValue([{ ...paella, stock: 2 }, tarta]);
    render(<PedidoSection />);
    await screen.findByText("Paella");
    await userEvent.click(screen.getAllByRole("button", { name: "Añadir al pedido" })[0]);
    await userEvent.type(screen.getByPlaceholderText("Nombre"), "Ana");
    await userEvent.type(screen.getByPlaceholderText("Teléfono (opcional)"), "600000000");
    await userEvent.click(screen.getByRole("button", { name: "Confirmar pedido" }));

    expect(await screen.findByText(/Pedido #8 guardado/)).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nombre")).toHaveValue("");
    expect(screen.getByPlaceholderText("Teléfono (opcional)")).toHaveValue("");
    expect(screen.getByText("Tu pedido está vacío.")).toBeInTheDocument();
  });

  it("recarga el catálogo tras confirmar para mostrar el stock descontado", async () => {
    api.crearPedido.mockResolvedValue({ id: 9, cliente: "Ana", total: 10, estado: "confirmado", items: [] });
    api.listar.mockResolvedValueOnce([paella, tarta]).mockResolvedValue([{ ...paella, stock: 2 }, tarta]);
    render(<PedidoSection />);
    await screen.findByText("Stock disponible: 3");
    await userEvent.click(screen.getAllByRole("button", { name: "Añadir al pedido" })[0]);
    await userEvent.type(screen.getByPlaceholderText("Nombre"), "Ana");
    await userEvent.click(screen.getByRole("button", { name: "Confirmar pedido" }));
    expect(await screen.findByText("Stock disponible: 2")).toBeInTheDocument();
    expect(api.listar).toHaveBeenCalledTimes(2);
  });

  it("no deja confirmar sin nombre", async () => {
    render(<PedidoSection />);
    await screen.findByText("Paella");
    await userEvent.click(screen.getAllByRole("button", { name: "Añadir al pedido" })[0]);
    expect(screen.getByRole("button", { name: "Confirmar pedido" })).toBeDisabled();
  });

  it("propaga el error si el backend rechaza el pedido", async () => {
    api.crearPedido.mockRejectedValue(new Error('No hay stock suficiente de "Paella"'));
    render(<PedidoSection />);
    await screen.findByText("Paella");
    await userEvent.click(screen.getAllByRole("button", { name: "Añadir al pedido" })[0]);
    await userEvent.type(screen.getByPlaceholderText("Nombre"), "Ana");
    await userEvent.click(screen.getByRole("button", { name: "Confirmar pedido" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("No hay stock suficiente");
  });
});

describe("HistorialPage", () => {
  it("lista los pedidos guardados", async () => {
    api.listarPedidos.mockResolvedValue([
      { id: 3, cliente: "Ana", telefono: null, notas: null, estado: "confirmado", total: 20, createdAt: "2026-01-01T10:00:00Z", items: [{ productoId: 1, nombre: "Paella", precio: 10, cantidad: 2, subtotal: 20 }] },
    ]);
    render(<HistorialPage />);
    expect(await screen.findByText("Pedido #3")).toBeInTheDocument();
    expect(screen.getByText("2 x Paella")).toBeInTheDocument();
    expect(screen.getAllByText("20.00 €").length).toBeGreaterThan(0);
  });

  it("muestra la fecha en la hora de Madrid", async () => {
    api.listarPedidos.mockResolvedValue([
      { id: 5, cliente: "Ana", telefono: null, notas: null, estado: "confirmado", total: 20, createdAt: "2026-01-01T10:00:00Z", items: [] },
    ]);
    render(<HistorialPage />);
    await screen.findByText("Pedido #5");
    // 10:00 UTC son las 11:00 en Madrid (invierno)
    expect(screen.getByText(/11:00/)).toBeInTheDocument();
  });

  it("avisa cuando no hay pedidos", async () => {
    render(<HistorialPage />);
    expect(await screen.findByText(/Todavía no has realizado ningún pedido/)).toBeInTheDocument();
  });

  it("muestra los pedidos cancelados", async () => {
    api.listarPedidos.mockResolvedValue([{ id: 4, cliente: "Luis", telefono: null, notas: null, estado: "cancelado", total: 5, createdAt: null, items: [] }]);
    render(<HistorialPage />);
    expect(await screen.findByText("Cancelado")).toBeInTheDocument();
  });
});