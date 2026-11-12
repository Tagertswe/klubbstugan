<script setup lang="ts">
useSeoMeta({ title: "Träningspass", description: "Intervaller varje tisdag kl. 18 i tre grupper, långpass och Torsdagsgruppen." });
const { data } = await useFetch("/api/training");
</script>

<template>
  <div>
    <PageTitle title="Träna med oss" lead="Varje tisdag kl. 18 tränar vi intervaller i tre grupper från klubblokalen på Tennvägen 11 A i Torskors." />
    <div v-if="data" class="container training-page">
      <section aria-labelledby="groups-title">
        <h2 id="groups-title" class="section-title"><TitleMarker />Grupperna</h2>
        <div class="groups">
          <article v-for="group in data.groups" :key="group.slug" class="card group">
            <h3>{{ group.name }}</h3>
            <p>{{ group.description }}</p>
            <p v-if="group.meetTime" class="meet">Samling {{ group.meetTime }}</p>
          </article>
        </div>
      </section>

      <section aria-labelledby="plan-title">
        <h2 id="plan-title" class="section-title"><TitleMarker />Terminsplan</h2>
        <div class="table-wrap card" role="region" aria-label="Terminsplan, kan rullas i sidled" tabindex="0">
          <table>
            <thead>
              <tr>
                <th scope="col">Datum</th>
                <th v-for="group in data.groups" :key="group.slug" scope="col">{{ group.name }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in data.plan" :key="row.date">
                <th scope="row">{{ row.label }}</th>
                <td v-for="group in data.groups" :key="group.slug">{{ row.sessions[group.slug] ?? "–" }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="langpass" aria-labelledby="langpass-title" class="card info">
        <h2 id="langpass-title">Långpass</h2>
        <p>Flera lördagar per termin springer vi långpass med skyltade distanser, ofta med grill efteråt. Datumen finns i kalendern och i Nyheter.</p>
      </section>
      <section id="torsdagsgruppen" aria-labelledby="torsdag-title" class="card info">
        <h2 id="torsdag-title">Torsdagsgruppen</h2>
        <p>Torsdagsgruppen träffas på torsdagar kl. 10 vid Tennvägen 11 A. På torsdagskvällar kl. 17.30 är det lugn löpning från Västra Marks IP.</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.training-page {
  padding-top: var(--space-5);
  padding-bottom: var(--space-7);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
.groups {
  display: grid;
  gap: var(--space-4);
  margin-top: var(--space-4);
}
.group,
.info {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.group p,
.info p {
  margin: 0;
  color: var(--c-muted);
}
.meet {
  color: var(--tb-purple) !important;
  font-weight: 800;
}
.table-wrap {
  margin-top: var(--space-4);
  overflow-x: auto;
}
table {
  width: 100%;
  min-width: 560px;
  border-collapse: collapse;
}
th,
td {
  text-align: left;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--c-line);
}
thead th {
  background: var(--tb-ink);
  color: #fff;
  font-size: 0.8125rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
@media (min-width: 768px) {
  .groups {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
