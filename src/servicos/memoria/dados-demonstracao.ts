import type { EstadoMemoria } from "./index";

export const DADOS_DEMONSTRACAO: EstadoMemoria = {
  profissionais: [
    { id: "demo-cirurgiao", nome: "Cirurgião Exemplo", papel: "CIRURGIAO" },
    { id: "demo-anestesista", nome: "Anestesista Exemplo", papel: "ANESTESISTA" },
  ],
  procedimentos: [
    {
      id: "demo-ohe",
      nome: "OVARIOHISTECTOMIA (DEMONSTRAÇÃO)",
      descricaoTecnica:
        "Incisão retro umbilical com lâmina n° 23, divulsão de tecidos subcutâneos com tesoura de metzembaum. Incisão em estocada sobre linha Alba do m. Reto abdominal com lâmina n° 11 e ampliado com tesoura romba. Ligadura de pediculos ocaríamos com nylon 2-0 e coto uterino transfixado com 2-0 nylon. Sem intercorrências. Miorrafia com nylon 2-0 padrão simples continuo, hipoderme padrão colchoeiro modificado e dermorrafia nylon 2-0 sultan.",
      prescricao:
        "Prescrito: tramadol 4 mg/kg bid 5 dias, dipirona 25 mg/kg bid 5 dias, meloxicam 0,1 mg/kg Sid 3 dias. Uso obrigatório de colar elisabetano ou roupa cirúrgica, limpeza dos pontos com soro fisiológico e troca de curativo diariamente, repouso absoluto e retorno em 15 dias para retirada de pontos ou antes se necessário.",
      descricaoAnestesica: {
        asa: "I",
        mpa: "Cetamina (2mg/kg) + Xilazina (0,5mg/kg) + Morfina (0,2mg/kg) + Midazolam (0,2mg/kg) Administrados IM",
        inducao: "Propofol (4mg/kg) dose efeito IV",
        manutencao: "Isoflurano",
        bloqueioLocal: "Lidocaína (4mg/kg)",
        analgesiaTrans: "Fentanil (4mcg/kg) IV",
        antibioticoPre: "Cefalotina (30mg/kg) IV",
        posImediato: "Dipirona (25mg/kg) + Meloxicam (0,05mg/kg) SC + Tramadol (3mg/kg) SC",
        observacoes:
          "Sem intercorrências. Parâmetros fisiológicos se mantiveram dentro da normalidade para a espécie.",
      },
    },
    {
      id: "demo-incompleto",
      nome: "PROCEDIMENTO SEM DESCRIÇÃO ANESTÉSICA (DEMONSTRAÇÃO)",
      descricaoTecnica: "Texto de demonstração da técnica cirúrgica.",
      prescricao: "Prescrito: texto de demonstração.",
      descricaoAnestesica: null,
    },
  ],
};
