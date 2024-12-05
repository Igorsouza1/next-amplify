"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { createAcao } from "@/app/_actions/actions";

interface ExcelData {
  Name: string;
  Latitude: number;
  Longitude: number;
  Elevation: number;
  Time: string;
  Description: string;
  Mes: string;
  Atuacao: string;
  Acao: string;
}

export default function ExcelReader() {
  const [data, setData] = useState<ExcelData[]>([]);
  const [message, setMessage] = useState<{ type: "success" | "error" | null; text: string }>({
    type: null,
    text: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const bstr = e.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const parsedData = XLSX.utils.sheet_to_json(ws) as ExcelData[];

        if (parsedData.length === 0) {
          throw new Error("O arquivo Excel está vazio ou não contém dados válidos.");
        }

        const requiredColumns = ["Name", "Latitude", "Longitude", "Elevation", "Time", "Description", "Mes", "Atuacao", "Acao"];
        const missingColumns = requiredColumns.filter((col) => !(col in parsedData[0]));

        if (missingColumns.length > 0) {
          throw new Error(`Colunas ausentes no arquivo Excel: ${missingColumns.join(", ")}`);
        }

        setData(parsedData);
        setMessage({ type: "success", text: "Arquivo Excel lido com sucesso!" });
      } catch (error) {
        setMessage({
          type: "error",
          text: `Erro ao ler o arquivo: ${error instanceof Error ? error.message : "Formato inválido"}`,
        });
        setData([]);
      }
    };

    reader.readAsBinaryString(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSendExcel = async () => {
    if (data.length === 0) {
      setMessage({ type: "error", text: "Nenhum dado para enviar. Por favor, carregue um arquivo Excel válido primeiro." });
      return;
    }

    setIsLoading(true);
    setProgress(0);
    try {
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const formData = new FormData();
        formData.append("acao", row.Acao);
        formData.append("mes", row.Mes);
        formData.append("name", row.Name);
        formData.append("latitude", row.Latitude.toString());
        formData.append("longitude", row.Longitude.toString());
        formData.append("elevation", row.Elevation.toString());
        formData.append("time", row.Time);
        formData.append("description", row.Description);

        await createAcao(formData);
        
        // Update progress after each row is sent
        setProgress(Math.round(((i + 1) / data.length) * 100));
      }
      setMessage({ type: "success", text: "Dados do Excel enviados com sucesso!" });
    } catch (error) {
      setMessage({
        type: "error",
        text: `Erro ao enviar os dados: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Leitor de Dados Excel</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer mb-4 ${
            isDragActive ? "border-primary bg-primary/10" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Solte o arquivo Excel aqui...</p>
          ) : (
            <p>Arraste e solte um arquivo Excel aqui, ou clique para selecionar um arquivo</p>
          )}
        </div>

        {message.type && (
          <Alert variant={message.type === "error" ? "destructive" : "default"} className="mb-4">
            {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            <AlertTitle>{message.type === "success" ? "Sucesso" : "Erro"}</AlertTitle>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {data.length > 0 && (
          <>
            <div className="border rounded-md mb-4">
              <ScrollArea className="h-[400px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky top-0 bg-background">Name</TableHead>
                      <TableHead className="sticky top-0 bg-background">Latitude</TableHead>
                      <TableHead className="sticky top-0 bg-background">Longitude</TableHead>
                      <TableHead className="sticky top-0 bg-background">Elevation</TableHead>
                      <TableHead className="sticky top-0 bg-background">Time</TableHead>
                      <TableHead className="sticky top-0 bg-background">Description</TableHead>
                      <TableHead className="sticky top-0 bg-background">Mes</TableHead>
                      <TableHead className="sticky top-0 bg-background">Atuacao</TableHead>
                      <TableHead className="sticky top-0 bg-background">Acao</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="whitespace-nowrap">{row.Name}</TableCell>
                        <TableCell>{row.Latitude}</TableCell>
                        <TableCell>{row.Longitude}</TableCell>
                        <TableCell>{row.Elevation}</TableCell>
                        <TableCell className="whitespace-nowrap">{row.Time}</TableCell>
                        <TableCell>{row.Description}</TableCell>
                        <TableCell>{row.Mes}</TableCell>
                        <TableCell>{row.Atuacao}</TableCell>
                        <TableCell>{row.Acao}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
            <div className="space-y-4">
              {isLoading && (
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-center">{`${progress}% concluído`}</p>
                </div>
              )}
              <Button onClick={handleSendExcel} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Excel'
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

