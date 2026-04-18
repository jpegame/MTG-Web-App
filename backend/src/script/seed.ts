import { AppDataSource } from "../dataSource";
import { Ability } from "../models/ability";

type SeedAbility = Pick<Ability, "name" | "description"> & {
  aliases: string[];
};

const abilities: SeedAbility[] = [
  {
    name: "Flying/Voador",
    aliases: ["Flying"],
    description: "So pode ser bloqueada por criaturas com Flying ou Reach.",
  },
  {
    name: "Reach/Alcance",
    aliases: ["Reach"],
    description: "Pode bloquear criaturas com Flying.",
  },
  {
    name: "Trample/Atropelar",
    aliases: ["Trample"],
    description:
      "Dano excedente ao bloqueador e causado ao jogador ou planeswalker.",
  },
  {
    name: "Haste/Impeto",
    aliases: ["Haste"],
    description: "Pode atacar e usar habilidades no turno em que entra.",
  },
  {
    name: "Vigilance/Vigilancia",
    aliases: ["Vigilance"],
    description: "Nao vira ao atacar.",
  },
  {
    name: "Deathtouch/Toque Mortifero",
    aliases: ["Deathtouch"],
    description:
      "Qualquer quantidade de dano e suficiente para destruir uma criatura.",
  },
  {
    name: "Lifelink/Vinculo com a Vida",
    aliases: ["Lifelink"],
    description: "Voce ganha vida igual ao dano causado.",
  },
  {
    name: "First Strike/Iniciativa",
    aliases: ["First Strike"],
    description: "Causa dano antes das criaturas sem essa habilidade.",
  },
  {
    name: "Double Strike/Iniciativa Dupla",
    aliases: ["Double Strike"],
    description: "Causa dano duas vezes (iniciativa e dano normal).",
  },
  {
    name: "Hexproof/Resistencia a Magia",
    aliases: ["Hexproof"],
    description: "Nao pode ser alvo de magicas ou habilidades do oponente.",
  },
  {
    name: "Shroud/Manto",
    aliases: ["Shroud"],
    description: "Nao pode ser alvo de nenhuma magica ou habilidade.",
  },
  {
    name: "Indestructible/Indestrutivel",
    aliases: ["Indestructible"],
    description: "Nao pode ser destruida por dano ou efeitos de destruicao.",
  },
  {
    name: "Menace/Ameaca",
    aliases: ["Menace"],
    description: "So pode ser bloqueada por duas ou mais criaturas.",
  },
  {
    name: "Flash/Lampejo",
    aliases: ["Flash"],
    description:
      "Pode ser conjurada a qualquer momento que voce poderia jogar uma instantanea.",
  },
  {
    name: "Defender/Defensor",
    aliases: ["Defender"],
    description: "Nao pode atacar.",
  },
  {
    name: "Ward/Ala",
    aliases: ["Ward"],
    description:
      "O oponente precisa pagar um custo adicional para escolher essa criatura como alvo.",
  },
];

async function seedAbilities() {
  await AppDataSource.initialize();

  try {
    const repository = AppDataSource.getRepository(Ability);

    for (const abilityData of abilities) {
      const possibleNames = [abilityData.name, ...abilityData.aliases];
      const existingAbility = await repository.findOne({
        where: possibleNames.map((name) => ({ name })),
      });

      if (existingAbility) {
        repository.merge(existingAbility, abilityData);
        await repository.save(existingAbility);
        continue;
      }

      const ability = repository.create(abilityData);
      await repository.save(ability);
    }

    console.log(`Seed concluido: ${abilities.length} habilidades processadas.`);
  } finally {
    await AppDataSource.destroy();
  }
}

void seedAbilities().catch((error) => {
  console.error("Erro ao executar o seed de habilidades:", error);
  throw error;
});