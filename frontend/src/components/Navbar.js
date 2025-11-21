import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, Form, Button, InputGroup } from 'react-bootstrap';
import { FaSearch, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = (searchQuery || '').trim();
    if (q) {
      navigate(`/juegos?search=${encodeURIComponent(q)}`);
    } else {
      navigate('/juegos');
    }
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="navbar">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          <img
            src="/logo.svg"
            width="34"
            height="34"
            className="d-inline-block align-top me-2"
            alt="GameTracker"
          />
          GameTracker
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/juegos">TIENDA</Nav.Link>
            <Nav.Link as={Link} to="/juegos">BIBLIOTECA</Nav.Link>
            <Nav.Link as={Link} to="/reseñas">RESEÑAS</Nav.Link>
            <Nav.Link as={Link} to="/estadisticas">ESTADÍSTICAS</Nav.Link>
          </Nav>
          <Form className="d-flex" onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Buscar juegos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Buscar"
              />
              <Button variant="outline-light" type="submit">
                <FaSearch />
              </Button>
            </InputGroup>
          </Form>
          <Nav className="ms-2">
            <Nav.Link as={Link} to="/agregar-juego" className="btn btn-success btn-sm">
              Agregar Juego
            </Nav.Link>
            <Nav.Link href="#" className="ms-2">
              <FaUserCircle size={24} />
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
