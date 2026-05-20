"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Input, Select, SelectItem, Spinner, useDisclosure,
} from "@/components/ui/compat";
import { useAuth } from "@/lib/auth/AuthContext";
import { getUsuarios, createUsuario, updateUsuario, toggleUsuarioActivo } from "@/lib/services/usuario.service";
import { getUEBsByEmpresa } from "@/lib/services/ueb.service";
import type { UsuarioPublico, UEB, RolUsuario } from "@/types/models";
import { TableSkeleton } from "@/components/ui/TableSkeleton";

export default function AdminUsuarios() {
  const { empresa } = useAuth();
  const [uebs, setUebs] = useState<UEB[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioPublico[]>([]);
  const [loading, setLoading] = useState(true);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isToggleOpen, onOpen: onToggleOpen, onClose: onToggleClose } = useDisclosure();

  const [editando, setEditando] = useState<UsuarioPublico | null>(null);
  const [toggling, setToggling] = useState<UsuarioPublico | null>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState<string>("supervisor");
  const [uebId, setUebId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    if (!empresa) return;
    const data = await getUsuarios();
    setUsuarios(data);
  }, [empresa]);

  useEffect(() => {
    if (!empresa) return;
    setLoading(true);
    Promise.all([getUsuarios(), getUEBsByEmpresa()])
      .then(([usrs, ubs]) => { setUsuarios(usrs); setUebs(ubs); })
      .finally(() => setLoading(false));
  }, [empresa]);

  const resetForm = () => { setUsername(""); setPassword(""); setNombre(""); setRol("supervisor"); setUebId(""); setError(""); };
  const abrirCrear = () => { setEditando(null); resetForm(); onOpen(); };
  const abrirEditar = (u: UsuarioPublico) => {
    setEditando(u); setUsername(u.username); setPassword(""); setNombre(u.nombre ?? ""); setRol(u.rol); setUebId(u.ueb_id ? String(u.ueb_id) : "");
    setError(""); onOpen();
  };
  const abrirToggle = (u: UsuarioPublico) => { setToggling(u); onToggleOpen(); };

  const handleGuardar = async () => {
    if (!empresa) return;
    if (!username.trim() || (!editando && !password.trim())) { setError("Usuario y contraseña son obligatorios."); return; }
    if (rol === "supervisor" && !uebId) { setError("El supervisor debe tener una UEB asignada."); return; }
    setError(""); setSaving(true);
    try {
      if (editando) {
        await updateUsuario(editando.id, { username, nombre: nombre || undefined, rol: rol as RolUsuario, ueb_id: uebId ? Number(uebId) : undefined });
      } else {
        await createUsuario({ username, password, nombre: nombre || undefined, rol: rol as RolUsuario, ueb_id: uebId ? Number(uebId) : undefined, empresa_id: empresa.id });
      }
      onClose(); cargar();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al guardar.");
    } finally { setSaving(false); }
  };

  const handleToggle = async () => {
    if (!toggling) return;
    setSaving(true);
    try { await toggleUsuarioActivo(toggling.id, !toggling.activo); onToggleClose(); cargar(); }
    finally { setSaving(false); }
  };

  const uebNombre = (id: number | null) => id ? (uebs.find((u) => u.id === id)?.nombre ?? "—") : "—";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Usuarios</h1>
          <p className="text-sm text-default-500">Administradores y supervisores de la empresa</p>
        </div>
        <Button color="primary" onPress={abrirCrear}>+ Nuevo usuario</Button>
      </div>

      <Table aria-label="Usuarios" removeWrapper>
        <TableHeader>
          <TableColumn>Usuario</TableColumn>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Rol</TableColumn>
          <TableColumn>UEB</TableColumn>
          <TableColumn>Estado</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No hay usuarios registrados.">
          {loading
            ? <TableSkeleton columns={6} />
            : usuarios.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-mono text-sm">{u.username}</TableCell>
                <TableCell className="text-sm">{u.nombre ?? "—"}</TableCell>
                <TableCell>
                  <Chip color={u.rol === "admin" ? "primary" : "secondary"} variant="flat" size="sm">
                    {u.rol === "admin" ? "Administrador" : "Supervisor"}
                  </Chip>
                </TableCell>
                <TableCell className="text-sm">{uebNombre(u.ueb_id ?? null)}</TableCell>
                <TableCell><Chip color={u.activo ? "success" : "default"} variant="flat" size="sm">{u.activo ? "Activo" : "Inactivo"}</Chip></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="flat" onPress={() => abrirEditar(u)}>Editar</Button>
                    <Button size="sm" variant="flat" color={u.activo ? "danger" : "success"} onPress={() => abrirToggle(u)}>
                      {u.activo ? "Desactivar" : "Activar"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>{editando ? "Editar usuario" : "Nuevo usuario"}</ModalHeader>
          <ModalBody className="space-y-3">
            <Input label="Nombre de usuario" isRequired value={username} onValueChange={setUsername} />
            {!editando && <Input label="Contraseña" type="password" isRequired value={password} onValueChange={setPassword} />}
            <Input label="Nombre completo" value={nombre} onValueChange={setNombre} />
            <Select label="Rol" isRequired selectedKeys={rol ? [rol] : []} onSelectionChange={(k) => { setRol([...k][0] as string ?? "supervisor"); if ([...k][0] === "admin") setUebId(""); }}>
              <SelectItem key="admin">Administrador</SelectItem>
              <SelectItem key="supervisor">Supervisor</SelectItem>
            </Select>
            {rol === "supervisor" && (
              <Select label="UEB asignada" isRequired selectedKeys={uebId ? [uebId] : []} onSelectionChange={(k) => setUebId([...k][0] as string ?? "")}>
                {uebs.map((u) => <SelectItem key={String(u.id)}>{u.nombre}</SelectItem>)}
              </Select>
            )}
            {error && <p className="text-sm text-danger">{error}</p>}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>Cancelar</Button>
            <Button color="primary" isLoading={saving} onPress={handleGuardar}>Guardar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isToggleOpen} onClose={onToggleClose}>
        <ModalContent>
          <ModalHeader>{toggling?.activo ? "Desactivar usuario" : "Activar usuario"}</ModalHeader>
          <ModalBody>
            <p className="text-sm">¿{toggling?.activo ? "Desactivar" : "Activar"} al usuario <strong>{toggling?.username}</strong>?</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onToggleClose}>Cancelar</Button>
            <Button color={toggling?.activo ? "danger" : "success"} isLoading={saving} onPress={handleToggle}>
              {toggling?.activo ? "Desactivar" : "Activar"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
