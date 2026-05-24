export interface HistoricoAnimal{
    nomeAnimal: string;
    data: string;
    titulo: string;
    descricao: string;
    petId: number;
    horario: string;
    status: 'Agendado' | 'Pendente' | 'Concluido' | 'Cancelado';
}