<script setup>
defineProps({
  equipo: { type: Object, required: true },
})
const emit = defineEmits(['cerrar'])

function formatearFecha(fecha) {
  if (!fecha) return ''
  const [anio, mes, dia] = fecha.split('-')
  return `${dia}-${mes}-${anio}`
}
</script>

<template>
  <div class="modal d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5)">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ equipo.nombre }}</h5>
          <button type="button" class="btn-close" @click="emit('cerrar')"></button>
        </div>
        <div class="modal-body">
          <dl class="row mb-0">
            <dt class="col-sm-5">Código de inventario</dt>
            <dd class="col-sm-7">{{ equipo.codigoInventario }}</dd>
            <dt class="col-sm-5">Tipo</dt>
            <dd class="col-sm-7">{{ equipo.tipo }}</dd>
            <dt class="col-sm-5">Marca</dt>
            <dd class="col-sm-7">{{ equipo.marca }}</dd>
            <dt class="col-sm-5">Modelo</dt>
            <dd class="col-sm-7">{{ equipo.modelo }}</dd>
            <dt class="col-sm-5">Ubicación</dt>
            <dd class="col-sm-7">{{ equipo.ubicacion }}</dd>
            <dt class="col-sm-5">Estado</dt>
            <dd class="col-sm-7">{{ equipo.estado }}</dd>
            <dt class="col-sm-5">Fecha de adquisición</dt>
            <dd class="col-sm-7">{{ formatearFecha(equipo.fechaAdquisicion) }}</dd>
            <dt class="col-sm-5">Observaciones</dt>
            <dd class="col-sm-7">{{ equipo.observaciones || '—' }}</dd>
          </dl>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="emit('cerrar')">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>