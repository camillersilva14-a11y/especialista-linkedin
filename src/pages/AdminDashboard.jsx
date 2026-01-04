import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, ShieldAlert, Phone, Mail, User, Trash2, Download, Edit2, Save, X, MoreHorizontal, FileText, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    checkUserAndFetchLeads();
  }, []);

  const checkUserAndFetchLeads = async () => {
    try {
      setLoading(true);
      const user = await base44.auth.me();
      setCurrentUser(user);

      if (!user || user.role !== "admin") {
        setError("Acesso restrito: Apenas administradores podem visualizar esta página.");
        setLoading(false);
        return;
      }

      const { data } = await base44.entities.Lead.list("-created_date", 100);
      setLeads(data);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError("Erro ao verificar permissões ou carregar leads.");
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(
    (lead) =>
      lead.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.whatsapp?.includes(searchTerm)
  );

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await base44.entities.Lead.update(leadId, { status: newStatus });
      setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  const startEdit = (lead) => {
    setEditingId(lead.id);
    setEditForm({ ...lead });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    try {
      await base44.entities.Lead.update(editingId, editForm);
      setLeads(leads.map(l => l.id === editingId ? { ...editForm } : l));
      setEditingId(null);
    } catch (err) {
      console.error("Erro ao salvar edição:", err);
    }
  };

  const exportLeads = () => {
    const headers = ["Nome,Email,WhatsApp,Status,Data,Notas"];
    const csvContent = leads.map(l => 
      `"${l.full_name}","${l.email}","${l.whatsapp}","${l.status}","${l.created_date}","${l.notes || ''}"`
    ).join("\n");
    
    const blob = new Blob([headers + "\n" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_export_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (leadId) => {
    try {
      await base44.entities.Lead.delete(leadId);
      setLeads(leads.filter(l => l.id !== leadId));
    } catch (err) {
      console.error("Erro ao excluir lead:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "novo": return "bg-blue-100 text-blue-800";
      case "contatado": return "bg-yellow-100 text-yellow-800";
      case "convertido": return "bg-green-100 text-green-800";
      case "arquivado": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
        <Alert variant="destructive" className="max-w-md bg-white shadow-lg">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Acesso Negado</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <div className="mt-4">
             <Button variant="outline" onClick={() => window.location.href = '/'}>
                Voltar para Home
             </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
            <p className="text-gray-500">Gerenciamento de Leads e Usuários</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-600 mr-2">
                Olá, <span className="font-semibold">{currentUser?.full_name || 'Admin'}</span>
            </div>
            <Button variant="outline" onClick={exportLeads} className="mr-2 gap-2">
              <Download className="h-4 w-4" /> Exportar CSV
            </Button>
            <Button variant="outline" onClick={checkUserAndFetchLeads}>
              Atualizar Lista
            </Button>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="border-b bg-white">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <CardTitle>Leads Cadastrados ({filteredLeads.length})</CardTitle>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar por nome, email ou whats..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Nome Completo</TableHead>
                    <TableHead>Contatos</TableHead>
                    <TableHead>Notas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                        Nenhum lead encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLeads.map((lead) => (
                      <TableRow key={lead.id} className={`hover:bg-gray-50 ${editingId === lead.id ? "bg-blue-50/50" : ""}`}>
                        <TableCell className="whitespace-nowrap text-gray-500 w-32 align-top">
                          {lead.created_date ? format(new Date(lead.created_date), "dd/MM/yyyy") : "-"}
                          <br />
                          <span className="text-xs">{lead.created_date ? format(new Date(lead.created_date), "HH:mm") : ""}</span>
                        </TableCell>
                        
                        {editingId === lead.id ? (
                          <>
                            <TableCell className="align-top">
                              <div className="space-y-2">
                                <Input 
                                  value={editForm.full_name || ""} 
                                  onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                                  placeholder="Nome Completo"
                                  className="h-8"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="align-top">
                              <div className="space-y-2">
                                <Input 
                                  value={editForm.email || ""} 
                                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                  placeholder="Email"
                                  className="h-8"
                                />
                                <Input 
                                  value={editForm.whatsapp || ""} 
                                  onChange={(e) => setEditForm({...editForm, whatsapp: e.target.value})}
                                  placeholder="WhatsApp"
                                  className="h-8"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="align-top">
                              <Textarea
                                value={editForm.notes || ""}
                                onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                                placeholder="Notas privadas..."
                                className="min-h-[80px] text-sm"
                              />
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className="align-top">
                              <div className="flex items-center gap-2 font-medium text-gray-900">
                                <User className="h-4 w-4 text-gray-400" />
                                {lead.full_name}
                              </div>
                            </TableCell>
                            <TableCell className="align-top">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Mail className="h-3 w-3" />
                                  {lead.email}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Phone className="h-3 w-3" />
                                  {lead.whatsapp}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="align-top max-w-[200px]">
                              {lead.notes ? (
                                <div className="flex items-start gap-1 text-sm text-gray-600 bg-yellow-50 p-2 rounded border border-yellow-100">
                                  <FileText className="h-3 w-3 mt-0.5 flex-shrink-0 text-yellow-600" />
                                  <span className="line-clamp-3">{lead.notes}</span>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400 italic">Sem notas</span>
                              )}
                            </TableCell>
                          </>
                        )}

                        <TableCell className="align-top">
                          {editingId === lead.id ? (
                            <div className="flex items-center gap-2">
                                <Select
                                  value={editForm.status || "novo"}
                                  onValueChange={(value) => setEditForm({...editForm, status: value})}
                                >
                                  <SelectTrigger className="w-[130px] h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="novo">Novo</SelectItem>
                                    <SelectItem value="contatado">Contatado</SelectItem>
                                    <SelectItem value="convertido">Convertido</SelectItem>
                                    <SelectItem value="arquivado">Arquivado</SelectItem>
                                  </SelectContent>
                                </Select>
                            </div>
                          ) : (
                             <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-full justify-start p-0 hover:bg-transparent">
                                  <Badge className={`${getStatusColor(lead.status)} hover:opacity-80 cursor-pointer`}>
                                    {lead.status || "novo"}
                                  </Badge>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                <DropdownMenuLabel>Alterar Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={lead.status} onValueChange={(val) => handleStatusChange(lead.id, val)}>
                                  <DropdownMenuRadioItem value="novo">Novo</DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem value="contatado">Contatado</DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem value="convertido">Convertido</DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem value="arquivado">Arquivado</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </TableCell>

                        <TableCell className="text-right align-top">
                          <div className="flex justify-end gap-1">
                            {editingId === lead.id ? (
                              <>
                                <Button size="sm" variant="ghost" onClick={saveEdit} className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50">
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700">
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button size="sm" variant="ghost" onClick={() => startEdit(lead)} className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Excluir Lead?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Esta ação não pode ser desfeita. O lead <b>{lead.full_name}</b> será permanentemente removido.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete(lead.id)} className="bg-red-600 hover:bg-red-700">
                                        Excluir
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}