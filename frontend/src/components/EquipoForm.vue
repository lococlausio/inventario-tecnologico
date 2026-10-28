<script setup>
import { reactive, ref } from 'vue'
import { ESTADOS } from '../constants'
import { crearEquipo, actualizarEquipo } from '../services/api'

const props = defineProps({
  equipo: { type: Object, default: null },
})
const emit = defineEmits(['guardado', 'cancelar'])

const form = reactive({
  codigoInventario: props.equipo?.codigoInventario ?? '',
  nombre: props.equipo?.nombre ?? '',
  tipo: props.equipo?.tipo ?? '',
  marca: props.equipo?.marca ?? '',
  modelo: props.equipo?.modelo ?? '',
  ubicacion: props.equipo?.ubicacion ?? '',
  estado: props.equipo?.estado ?? 'Disponible',
  fechaAdquisicion: props.equipo?.fechaAdquisicion ?? '',
  observaciones: props.equipo?.observaciones ?? '',
})

const errores = ref([])
const guardando = ref(false)

async function guardar() {
  errores.value = []
  guardando.value = true
  try {
    if (props.equipo) {
      await actualizarEquipo(props.equipo.id, { ...form })
    } else {
      await crearEquipo({ ...form })
    }
    emit('guardado')
  } catch (e) {
    errores.value = e.detalles ?? [e.message]
  } finally {
    guardando.value = false
  }
}
</script>

<template>
  <div class="modal d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <form novalidate @submit.prevent="guardar">
          <div class="modal-header">
            <h5 class="modal-title">{{ equipo ? 'Editar equipo' : 'Nuevo equipo' }}</h5>
            <button type="button" class="btn-close" @click="emit('cancelar')"></button>
          </div>

          <div class="modal-body">
            <div v-if="errores.length" class="alert alert-danger">
              <ul class="mb-0">
                <li v-for="(mensaje, i) in errores" :key="i">{{ mensaje }}</li>
              </ul>
            </div>

            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Código de inventario *</label>
                <input v-model="form.codigoInventario" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Nombre *</label>
                <input v-model="form.nombre" class="form-control" />
              </div>
              <div class="col-md-4">
                <label class="form-label">Tipo *</label>
                <input v-model="form.tipo" class="form-control" placeholder="Notebook, PC, Monitor..." />
              </div>
              <div class="col-md-4">
                <label class="form-label">Marca *</label>
                <input v-model="form.marca" class="form-control" />
              </div>
              <div class="col-md-4">
                <label class="form-label">Modelo *</label>
                <input v-model="form.modelo" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Ubicación *</label>
                <input v-model="form.ubicacion" class="form-control" />
              </div>
              <div class="col-md-3">
                <label class="form-label">Estado *</label>
                <select v-model="form.estado" class="form-select">
                  <option v-for="estado in ESTADOS" :key="estado" :value="estado">
                    {{ estado }}
                  </option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Fecha de adquisición *</label>
                <input v-model="form.fechaAdquisicion" type="date" class="form-control" />
              </div>
              <div class="col-12">
                <label class="form-label">Observaciones</label>
                <textarea v-model="form.observaciones" class="form-control" rows="3"></textarea>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="emit('cancelar')">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" :disabled="guardando">
              {{ guardando ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>