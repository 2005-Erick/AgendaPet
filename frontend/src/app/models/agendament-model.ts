export type Agendamento = {
  id: number;
  nomeAnimal: string;
  petId: number;
  servico: string;
  descricao?: string;
  horario: string;
  titulo: string;  
  data: string;
  dataFormatada?: string; // ex: "OUT 12"
  cidade: string;


  status: 'Pendente' | 'Concluido' | 'Cancelado' | 'Agendado';
};