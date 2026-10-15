import { expect, test } from '@playwright/test'

test('la portada y la navegación caben en el móvil', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Español fundamental' })).toBeVisible()
  await expect(page.locator('.activity-card')).toHaveCount(3)
  await expect(page.locator('body')).toHaveJSProperty('scrollWidth', await page.locator('body').evaluate((body) => body.clientWidth))

  for (const name of ['Palabras', 'Verbos', 'Frases']) {
    await page.getByRole('link', { name, exact: true }).click()
    await expect(page.getByRole('navigation', { name: 'Navegación principal' })).toBeVisible()
  }
})

test('permite completar una pregunta de vocabulario', async ({ page }) => {
  await page.goto('/#/vocabulario')
  await page.getByRole('button', { name: 'Empezar práctica' }).click()
  const input = page.getByLabel('Tu palabra')
  await expect(input).toBeVisible()
  await input.fill('respuesta de prueba')
  await page.getByRole('button', { name: 'Comprobar' }).click()
  await expect(page.getByRole('status')).toBeVisible()
})

test('configura y abre la práctica de verbos', async ({ page }) => {
  await page.goto('/#/verbos')
  await page.getByRole('button', { name: 'Empezar práctica' }).click()
  await expect(page.getByLabel('Forma verbal')).toBeVisible()
})

test('abre escritura, valida una respuesta vacía y ejecuta el corrector local', async ({ page }) => {
  await page.goto('/#/frases')
  await page.getByRole('button', { name: 'Empezar a escribir' }).click()
  const button = page.getByRole('button', { name: 'Revisar mi español' })
  await expect(button).toBeDisabled()
  await page.getByLabel('Tu respuesta').fill('El árbol es verde.')
  await expect(button).toBeEnabled()
  await button.click()
  await expect(page.getByText('No se han detectado errores claros')).toBeVisible({ timeout: 30_000 })
  await page.getByRole('button', { name: 'Seguir editando' }).click()
  await page.getByLabel('Tu respuesta').fill('Yo ir a casa.')
  await page.getByRole('button', { name: 'Revisar mi español' }).click()
  await expect(page.locator('.issue')).toHaveCount(1, { timeout: 30_000 })
  await expect(page.locator('.incorrect-fragment')).toHaveText('ir')
  await expect(page.locator('.suggestions button')).toHaveCount(1)
  await expect(page.locator('.suggestions button')).toContainText('voy')
  await page.getByRole('button', { name: 'Seguir editando' }).click()
  await page.getByLabel('Tu respuesta').fill('Ayer voy al parque.')
  await page.getByRole('button', { name: 'Revisar mi español' }).click()
  await expect(page.locator('.incorrect-fragment')).toHaveText('voy', { timeout: 30_000 })
  await expect(page.locator('.suggestions button')).toContainText('fui')
})
