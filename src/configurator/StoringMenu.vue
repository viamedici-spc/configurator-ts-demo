<script setup lang="ts">
import {useSession} from "../utils/Contexts";
import {StoredConfiguration} from "@viamedici-spc/configurator-ts";

const session = useSession();

export type StoredConfigurationEnvelop = {
  readonly type: "spc-stored-configuration",
  readonly storedConfiguration: StoredConfiguration
}

const storeConfiguration = async () => {
  const storedConfiguration = await session.storeConfiguration();
  const envelop = {
    type: "spc-stored-configuration",
    storedConfiguration: storedConfiguration
  } satisfies StoredConfigurationEnvelop;

  const json = JSON.stringify(envelop);
  const blob = new Blob([json], {type: "application/json"});
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "Configuration.json";

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const restoreConfiguration = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = `.json`;

  input.onchange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) {
      return;
    }

    const file = target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const envelop = JSON.parse(reader.result as string) as StoredConfigurationEnvelop;
      if (envelop.type !== "spc-stored-configuration") {
        alert("The file has a wrong type.");
        return;
      }

      session.restoreConfiguration(envelop.storedConfiguration, {
        type: "DropExistingDecisions",
        conflictHandling: {type: "Automatic"}
      });
    };

    reader.onerror = () => {
      alert("An error occurred while reading the file.");
      return;
    };

    reader.readAsText(file);
  };

  input.click();
};

</script>

<template>
  <div class="storing-menu">
    <button @click="storeConfiguration">
      Store configuration
    </button>
    <button @click="restoreConfiguration">
      Restore configuration
    </button>
  </div>
</template>

<style scoped>
.storing-menu {
  grid-area: storing-menu;
  display: flex;
  flex-direction: column;
  gap: 1em;
  background-color: var(--color-base-1);
  padding: var(--size-card-padding);
  border-radius: var(--shape-card-border-radius);
  box-shadow: var(--shadow-card);
}

</style>
