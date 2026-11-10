"use client";

import { useCallback, useEffect, useState } from "react";
import { getDatabase } from "@/lib/persistence/database";
import { carregarDadosDemonstracao } from "@/lib/persistence/demo/load";
import { resetarDadosDemonstracao } from "@/lib/persistence/demo/reset";
import {
  obterEstadoDadosDemonstracao,
  type EstadoDadosDemonstracao,
} from "@/lib/persistence/demo/state";
import { notificarDadosFinanceirosAtualizados } from "@/lib/persistence/events/dados-financeiros";

interface UseDemonstracaoResult {
  estado: EstadoDadosDemonstracao | null;
  isLoading: boolean;
  error: Error | null;
  carregar: () => Promise<void>;
  resetar: () => Promise<void>;
}

export function useDemonstracao(): UseDemonstracaoResult {
  const [estado, setEstado] = useState<EstadoDadosDemonstracao | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const atualizarEstado = useCallback(async () => {
    const db = getDatabase();

    if (!db.isOpen()) {
      await db.open();
    }

    const novoEstado = await obterEstadoDadosDemonstracao(db);
    setEstado(novoEstado);

    return db;
  }, []);

  useEffect(() => {
    let ativo = true;

    async function inicializar() {
      try {
        setIsLoading(true);
        setError(null);

        const db = getDatabase();

        if (!db.isOpen()) {
          await db.open();
        }

        const novoEstado = await obterEstadoDadosDemonstracao(db);

        if (ativo) {
          setEstado(novoEstado);
        }
      } catch (erro) {
        if (ativo) {
          setError(
            erro instanceof Error
              ? erro
              : new Error("Não foi possível acessar os dados de demonstração."),
          );
        }
      } finally {
        if (ativo) {
          setIsLoading(false);
        }
      }
    }

    void inicializar();

    return () => {
      ativo = false;
    };
  }, []);

  const carregar = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const db = await atualizarEstado();
      await carregarDadosDemonstracao(db);

      const novoEstado = await obterEstadoDadosDemonstracao(db);
      setEstado(novoEstado);

      notificarDadosFinanceirosAtualizados();
    } catch (erro) {
      setError(
        erro instanceof Error
          ? erro
          : new Error("Não foi possível carregar os dados de demonstração."),
      );
    } finally {
      setIsLoading(false);
    }
  }, [atualizarEstado]);

  const resetar = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const db = await atualizarEstado();
      await resetarDadosDemonstracao(db);

      const novoEstado = await obterEstadoDadosDemonstracao(db);
      setEstado(novoEstado);

      notificarDadosFinanceirosAtualizados();
    } catch (erro) {
      setError(
        erro instanceof Error
          ? erro
          : new Error("Não foi possível resetar os dados de demonstração."),
      );
    } finally {
      setIsLoading(false);
    }
  }, [atualizarEstado]);

  return {
    estado,
    isLoading,
    error,
    carregar,
    resetar,
  };
}
