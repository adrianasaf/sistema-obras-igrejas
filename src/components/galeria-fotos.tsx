import type { Foto } from "@/lib/obra-detalhe-mock";

// Espaço reservado para as fotos: as imagens reais dependem do armazenamento
// de arquivos, ainda não implementado (PEN-013).
export function GaleriaFotos({
  fotos,
  vazio,
}: {
  fotos: Foto[];
  vazio: string;
}) {
  if (fotos.length === 0) {
    return <p className="text-sm text-muted">{vazio}</p>;
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {fotos.map((f) => (
        <li key={f.id}>
          <div
            role="img"
            aria-label={`Foto: ${f.legenda} (imagem de exemplo)`}
            className="flex aspect-[4/3] items-center justify-center rounded-md border border-border bg-background text-xs text-muted"
          >
            Foto de exemplo
          </div>
          <p className="mt-1 text-xs text-muted">{f.legenda}</p>
        </li>
      ))}
    </ul>
  );
}
