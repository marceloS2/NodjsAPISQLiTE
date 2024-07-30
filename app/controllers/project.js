const Project = require('../models/Project');

module.exports = app => {
  const createProject = (req, res) => {
    Project.createProject(req.body, (err, result) => {
      if (err) {
        return res.status(400).send({ error: 'Erro ao criar projeto' });
      }
      res.status(201).send({ id: result.id });
    });
  };

  const getProject = (req, res) => {
    Project.getProjects((err, projects) => {
      if (err) {
        return res.status(400).send({ error: 'Erro ao obter projetos' });
      }
      res.send(projects);
    });
  };

  const getProjectById = (req, res) => {
    const { projectId } = req.params;
    Project.getProjectById(projectId, (err, project) => {
      if (err) {
        return res.status(400).send({ error: 'Erro ao obter projeto' });
      }
      res.send(project);
    });
  };

  const updateProject = (req, res) => {
    const { projectId } = req.params;
    Project.updateProject(projectId, req.body, (err, result) => {
      if (err) {
        return res.status(400).send({ error: 'Erro ao atualizar projeto' });
      }
      if (result.changes === 0) {
        return res.status(404).send({ error: 'Projeto não encontrado' });
      }
      res.send({ message: 'Projeto atualizado com sucesso' });
    });
  };

  const removeProject = (req, res) => {
    const { projectId } = req.params;
    Project.removeProject(projectId, (err, result) => {
      if (err) {
        return res.status(400).send({ error: 'Erro ao deletar projeto' });
      }
      if (result.changes === 0) {
        return res.status(404).send({ error: 'Projeto não encontrado' });
      }
      res.send({ message: 'Projeto deletado com sucesso' });
    });
  };

  return { createProject, getProject, getProjectById, updateProject, removeProject };
};
