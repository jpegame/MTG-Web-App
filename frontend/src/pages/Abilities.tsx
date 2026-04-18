import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RefreshIcon from "@mui/icons-material/Refresh";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Collapse,
	Container,
	Divider,
	IconButton,
	Paper,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.API_URL || "http://localhost:3000";

type Ability = {
	id: number;
	name: string;
	description: string;
};

type AbilityFormData = {
	name: string;
	description: string;
};

const initialFormData: AbilityFormData = {
	name: "",
	description: "",
};

export default function Abilities() {
	const [abilities, setAbilities] = useState<Ability[]>([]);
	const [formData, setFormData] = useState<AbilityFormData>(initialFormData);
	const [editingAbilityId, setEditingAbilityId] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [feedback, setFeedback] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);

	const loadAbilities = async () => {
		setIsLoading(true);
		setFeedback(null);

		try {
			const response = await fetch(`${API_URL}/ability/`);

			if (!response.ok) {
				throw new Error("Nao foi possivel carregar as habilidades.");
			}

			const data: Ability[] = await response.json();
			setAbilities(data);
		} catch (error) {
			console.error(error);
			setFeedback({
				type: "error",
				message: "Nao foi possivel carregar as habilidades.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		void Promise.resolve().then(() => {
			void loadAbilities();
		});
	}, []);

	const resetForm = () => {
		setFormData(initialFormData);
		setEditingAbilityId(null);
		setIsFormOpen(false);
	};

	const handleChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = event.target;

		setFormData((current) => ({
			...current,
			[name]: value,
		}));
	};

	const handleEdit = (ability: Ability) => {
		setEditingAbilityId(ability.id);
		setIsFormOpen(true);
		setFormData({
			name: ability.name,
			description: ability.description,
		});
		setFeedback(null);
	};

	const handleDelete = async (abilityId: number) => {
		try {
			const response = await fetch(`${API_URL}/ability/${abilityId}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Nao foi possivel excluir a habilidade.");
			}

			setAbilities((current) =>
				current.filter((ability) => ability.id !== abilityId)
			);

			if (editingAbilityId === abilityId) {
				resetForm();
			}

			setFeedback({
				type: "success",
				message: "Habilidade removida com sucesso.",
			});
		} catch (error) {
			console.error(error);
			setFeedback({
				type: "error",
				message: "Nao foi possivel excluir a habilidade.",
			});
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSaving(true);
		setFeedback(null);

		try {
			const payload = {
				name: formData.name.trim(),
				description: formData.description.trim(),
			};

			if (!payload.name || !payload.description) {
				throw new Error("Preencha nome e descricao.");
			}

			const endpoint = editingAbilityId
				? `${API_URL}/ability/${editingAbilityId}`
				: `${API_URL}/ability/`;

			const response = await fetch(endpoint, {
				method: editingAbilityId ? "PUT" : "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				throw new Error("Nao foi possivel salvar a habilidade.");
			}

			const savedAbility: Ability = await response.json();

			setAbilities((current) => {
				if (editingAbilityId) {
					return current.map((ability) =>
						ability.id === savedAbility.id ? savedAbility : ability
					);
				}

				return [savedAbility, ...current];
			});

			setFeedback({
				type: "success",
				message: editingAbilityId
					? "Habilidade atualizada com sucesso."
					: "Habilidade criada com sucesso.",
			});

			resetForm();
		} catch (error) {
			console.error(error);
			setFeedback({
				type: "error",
				message:
					error instanceof Error ? error.message : "Nao foi possivel salvar a habilidade.",
			});
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Container maxWidth="lg">
			<Stack spacing={3}>
				<Box>
					<Typography variant="h4" sx={{ mb: 1 }}>
						Gerenciar Habilidades
					</Typography>
					<Typography color="text.secondary">
						Cadastre novas habilidades, edite os textos existentes e remova itens que nao forem mais usados.
					</Typography>
				</Box>

				{feedback ? <Alert severity={feedback.type}>{feedback.message}</Alert> : null}

				<Paper>
					<Stack spacing={3}>
						<Stack spacing={2}>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									gap: 2,
								}}
							>
								<Box>
									<Typography variant="h6">
										{editingAbilityId ? "Editar habilidade" : "Nova habilidade"}
									</Typography>
									<Typography color="text.secondary" variant="body2">
										Abra o formulario para cadastrar ou alterar uma habilidade.
									</Typography>
								</Box>

								<Button
									variant={isFormOpen ? "contained" : "outlined"}
									onClick={() => setIsFormOpen((current) => !current)}
									endIcon={
										<ExpandMoreIcon
											sx={{
												transition: "transform 0.2s ease",
												transform: isFormOpen ? "rotate(180deg)" : "rotate(0deg)",
											}}
										/>
									}
								>
									{'Nova habilidade'}
								</Button>
							</Box>

							<Collapse in={isFormOpen}>
								<Box component="form" onSubmit={handleSubmit}>
									<Stack spacing={2}>
										<TextField
											label="Nome"
											name="name"
											value={formData.name}
											onChange={handleChange}
											fullWidth
											required
										/>

										<TextField
											label="Descricao"
											name="description"
											value={formData.description}
											onChange={handleChange}
											fullWidth
											required
											multiline
											minRows={4}
										/>

										<Stack direction="row" spacing={1.5}>
											<Button
												type="submit"
												variant="contained"
												disabled={isSaving}
												startIcon={
													isSaving ? <CircularProgress size={18} color="inherit" /> : <SaveOutlinedIcon />
												}
											>
												{editingAbilityId ? "Salvar alteracoes" : "Criar habilidade"}
											</Button>

											<Button
												type="button"
												variant="outlined"
												onClick={resetForm}
												disabled={isSaving}
											>
												Limpar
											</Button>
										</Stack>
									</Stack>
								</Box>
							</Collapse>
						</Stack>

						<Divider />

						<Stack spacing={2}>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									gap: 2,
								}}
							>
								<Box>
									<Typography variant="h6">Habilidades cadastradas</Typography>
									<Typography color="text.secondary" variant="body2">
										{abilities.length} item(ns) encontrado(s)
									</Typography>
								</Box>

								<Button
									variant="outlined"
									startIcon={<RefreshIcon />}
									onClick={() => void loadAbilities()}
									disabled={isLoading}
								>
									Atualizar
								</Button>
							</Box>

							{isLoading ? (
								<Box
									sx={{
										minHeight: 240,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<CircularProgress />
								</Box>
							) : null}

							{!isLoading && abilities.length === 0 ? (
								<Alert severity="info">Nenhuma ability cadastrada.</Alert>
							) : null}

							{!isLoading ? (
								<Stack spacing={1.5}>
									{abilities.map((ability) => (
										<Paper
											key={ability.id}
											sx={{
												border: "1px solid",
												borderColor:
													editingAbilityId === ability.id ? "primary.main" : "divider",
											}}
										>
											<Box
												sx={{
													display: "flex",
													alignItems: "flex-start",
													justifyContent: "space-between",
													gap: 2,
												}}
											>
												<Box sx={{ minWidth: 0 }}>
													<Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
														{ability.name}
													</Typography>
													<Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
														{ability.description}
													</Typography>
												</Box>

												<Stack direction="row" spacing={0.5}>
													<IconButton
														color="primary"
														onClick={() => handleEdit(ability)}
														aria-label={`Editar ${ability.name}`}
													>
														<EditIcon />
													</IconButton>
													<IconButton
														color="error"
														onClick={() => void handleDelete(ability.id)}
														aria-label={`Excluir ${ability.name}`}
													>
														<DeleteIcon />
													</IconButton>
												</Stack>
											</Box>
										</Paper>
									))}
								</Stack>
							) : null}
						</Stack>
					</Stack>
				</Paper>
			</Stack>
		</Container>
	);
}
