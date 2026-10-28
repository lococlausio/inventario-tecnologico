const API_URL = 'http://localhost:3000/equipos'

async function request(url, options = {}) {
  let response
  try {
    response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    throw new Error(
      'No se pudo conectar con el servidor. Verifique que el backend esté en ejecución.',
    )
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const mensaje = data?.message ?? 'Error inesperado del servidor'
    const detalles = Array.isArray(mensaje) ? mensaje : [mensaje]
    const error = new Error(detalles.join('. '))
    error.detalles = detalles
    throw error
  }
  return data
}

export const getEquipos = () => request(API_URL)

export const getEquipo = (id) => request(`${API_URL}/${id}`)

export const crearEquipo = (equipo) =>
  request(API_URL, { method: 'POST', body: JSON.stringify(equipo) })

export const actualizarEquipo = (id, equipo) =>
  request(`${API_URL}/${id}`, { method: 'PATCH', body: JSON.stringify(equipo) })

export const eliminarEquipo = (id) => request(`${API_URL}/${id}`, { method: 'DELETE' })