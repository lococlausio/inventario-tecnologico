<script setup>
import { computed, onMounted, ref } from 'vue'
import { ESTADOS } from './constants'
import { getEquipos, getEquipo, eliminarEquipo } from './services/api'
import EquipoForm from './components/EquipoForm.vue'
import EquipoDetalle from './components/EquipoDetalle.vue'

const equipos = ref([])
const cargando = ref(false)
const error = ref('')

const busqueda = ref('')
const filtroEstado = ref('')

const formVisible = ref(false)
const equipoEnEdicion = ref(null)
const equipoDetalle = ref(null)

async function cargarEquipos() {
  cargando.value = true
  error.value = ''
  try {
    equipos.value = await getEquipos()
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}

onMounted(cargarEquipos)

const equiposFiltrados = computed(() => {
  const texto = busqueda.value.trim().toLowerCase()
  return equipos.value.filter((e) => {
    const coincideTexto =
      !texto ||
      [e.nombre, e.codigoInventario, e.tipo, e.ubicacion].some((campo) =>
        campo.toLowerCase().includes(texto),
      )
    const coincideEstado = !filtroEstado.value || e.estado === filtroEstado.value
    return coincideTexto && coincideEstado
  })
})

function abrirNuevo() {
  equipoEnEdicion.value = null
  formVisible.value = true
}

function abrirEdicion(equipo) {
  equipoEnEdicion.value = equipo
  formVisible.value = true
}

async function verDetalle(id) {
  error.value = ''
  try {
    equipoDetalle.value = await getEquipo(id)
  } catch (e) {
    error.value = e.message
  }
}

async function alGuardar() {
  formVisible.value = false
  await cargarEquipos()
}

async function eliminar(equipo) {
  const confirmado = window.confirm(
    `¿Está seguro de eliminar el equipo "${equipo.nombre}"? Esta acción no se puede deshacer.`,
  )
  if (!confirmado) return

  error.value = ''
  try {
    await eliminarEquipo(equipo.id)
    await cargarEquipos()
  } catch (e) {
    error.value = e.message
  }
}

function claseEstado(estado) {
  return {
    Disponible: 'bg-success',
    'En uso': 'bg-primary',
    Mantención: 'bg-warning text-dark',
    Baja: 'bg-secondary',
  }[estado]
}
</script>

<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 mb-0">Inventario de Equipamiento Tecnológico</h1>
      <button class="btn btn-primary" @click="abrirNuevo">+ Nuevo equipo</button>
    </div>

    <div class="row g-2 mb-3">
      <div class="col-md-8">
        <input
          v-model="busqueda"
          type="text"
          class="form-control"
          placeholder="Buscar por nombre, código, tipo o ubicación"
        />
      </div>
      <div class="col-md-4">
        <select v-model="filtroEstado" class="form-select">
          <option value="">Todos los estados</option>
          <option v-for="estado in ESTADOS" :key="estado" :value="estado">{{ estado }}</option>
        </select>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="cargando" class="text-center py-5">
      <div class="spinner-border" role="status"></div>
      <p class="mt-2 mb-0">Cargando equipos...</p>
    </div>

    <table v-else-if="equiposFiltrados.length" class="table table-hover align-middle">
      <thead>
        <tr>
          <th>Código</th>
          <th>Nombre</th>
          <th>Tipo</th>
          <th>Ubicación</th>
          <th>Estado</th>
          <th class="text-end">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="equipo in equiposFiltrados" :key="equipo.id">
          <td>{{ equipo.codigoInventario }}</td>
          <td>{{ equipo.nombre }}</td>
          <td>{{ equipo.tipo }}</td>
          <td>{{ equipo.ubicacion }}</td>
          <td>
            <span class="badge" :class="claseEstado(equipo.estado)">{{ equipo.estado }}</span>
          </td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-secondary me-1" @click="verDetalle(equipo.id)">
              Ver
            </button>
            <button class="btn btn-sm btn-outline-primary me-1" @click="abrirEdicion(equipo)">
              Editar
            </button>
            <button class="btn btn-sm btn-outline-danger" @click="eliminar(equipo)">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else-if="!error" class="text-muted text-center py-4">No se encontraron equipos.</p>

    <EquipoForm
      v-if="formVisible"
      :equipo="equipoEnEdicion"
      @guardado="alGuardar"
      @cancelar="formVisible = false"
    />
    <EquipoDetalle v-if="equipoDetalle" :equipo="equipoDetalle" @cerrar="equipoDetalle = null" />
  </div>
</template>